import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseStatus, EnrollmentStatus, Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { StorageService } from '../storage/storage.service';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class LearningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
    private readonly storage: StorageService
  ) {}

  async listCourses(input: { q?: string; category?: string; page?: number; limit?: number }) {
    const take = Math.min(input.limit ?? 20, 50);
    const page = Math.max(input.page ?? 1, 1);
    const skip = (page - 1) * take;

    if (input.q) {
      const result = await this.search.search('courses', input.q, { limit: take, offset: skip });
      const hits = result.hits as unknown[];
      return { data: hits, total: hits.length, page };
    }

    const where: Prisma.CourseWhereInput = { status: CourseStatus.PUBLISHED };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          instructor: { select: { id: true, displayName: true, avatarUrl: true } },
          _count: { select: { lessons: true, enrollments: true } }
        }
      }),
      this.prisma.course.count({ where })
    ]);

    return { data: courses, total, page };
  }

  async createCourse(instructorId: string, dto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        instructorId,
        title: dto.title,
        slug: `${this.slugify(dto.title)}-${Date.now().toString(36)}`,
        description: dto.description,
        language: dto.language ?? 'km-KH',
        level: dto.level,
        price: dto.price ?? 0,
        currency: dto.currency ?? 'KHR',
        status: dto.status ?? CourseStatus.DRAFT,
        tags: dto.tags ?? []
      }
    });

    await this.search.indexDocument('courses', {
      id: course.id,
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      tags: course.tags,
      status: course.status
    });

    return course;
  }

  async getCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, displayName: true, avatarUrl: true } },
        modules: { include: { lessons: true }, orderBy: { sortOrder: 'asc' } },
        lessons: { orderBy: { sortOrder: 'asc' } }
      }
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  enroll(userId: string, courseId: string) {
    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { status: EnrollmentStatus.ACTIVE },
      create: { userId, courseId }
    });
  }

  async completeLesson(userId: string, lessonId: string, dto: CompleteLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } }
    });
    if (!enrollment) throw new BadRequestException('Enroll in the course first');

    await this.prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: { completedAt: new Date(), progressPct: dto.progressPct ?? 100 },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completedAt: new Date(),
        progressPct: dto.progressPct ?? 100
      }
    });

    const [totalLessons, completedLessons] = await Promise.all([
      this.prisma.lesson.count({ where: { courseId: lesson.courseId } }),
      this.prisma.lessonProgress.count({
        where: { enrollmentId: enrollment.id, completedAt: { not: null } }
      })
    ]);
    const progressPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 100;

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPct,
        status: progressPct >= 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: progressPct >= 100 ? new Date() : undefined
      }
    });
  }

  async submitQuiz(quizId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const correct = quiz.questions.filter((question) => {
      return JSON.stringify(dto.answers[question.id]) === JSON.stringify(question.answerKey);
    }).length;
    const score = quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0;

    return {
      quizId,
      score,
      passed: score >= quiz.passScore,
      correct,
      total: quiz.questions.length
    };
  }

  async issueCertificate(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        user: true,
        course: true,
        certificate: true
      }
    });
    if (!enrollment) throw new BadRequestException('Enroll in the course first');
    if (enrollment.certificate) return enrollment.certificate;

    const qrToken = randomBytes(24).toString('base64url');
    const certificateNo = `FJ-LRN-${Date.now()}`;
    const verifyUrl = `/api/certificates/learning/${qrToken}/verify`;
    const pdf = await this.renderCertificatePdf({
      certificateNo,
      studentName: enrollment.user.displayName ?? enrollment.user.email ?? 'Student',
      courseTitle: enrollment.course.title,
      verifyUrl
    });
    const uploaded = await this.storage.putObject({
      folder: 'learning-certificates',
      filename: `${certificateNo}.pdf`,
      contentType: 'application/pdf',
      body: pdf
    });

    return this.prisma.learningCertificate.create({
      data: {
        userId,
        courseId,
        enrollmentId: enrollment.id,
        certificateNo,
        qrToken,
        pdfUrl: uploaded.publicUrl ?? uploaded.objectKey
      }
    });
  }

  async verifyCertificate(qrToken: string) {
    const certificate = await this.prisma.learningCertificate.findUnique({
      where: { qrToken },
      include: {
        user: { select: { id: true, displayName: true } },
        course: { select: { id: true, title: true, language: true } }
      }
    });
    if (!certificate) throw new NotFoundException('Certificate not found');
    return certificate;
  }

  private async renderCertificatePdf(input: {
    certificateNo: string;
    studentName: string;
    courseTitle: string;
    verifyUrl: string;
  }) {
    const qr = await QRCode.toBuffer(input.verifyUrl, { type: 'png', width: 180 });
    const doc = new PDFDocument({ size: 'A4', margin: 72 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(26).text('FarmJumnoy Certificate', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(16).text('This certifies that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(24).text(input.studentName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('has completed', { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(input.courseTitle, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Certificate No: ${input.certificateNo}`, { align: 'center' });
    doc.image(qr, doc.page.width / 2 - 60, doc.y + 24, { width: 120 });
    doc.end();

    return done;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
   .replace(/-+/g, `-`);
  }
}
