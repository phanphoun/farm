import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CertificationApplicationStatus, RoleName } from '@prisma/client';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { randomBytes } from 'node:crypto';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { CreateCertificationApplicationDto } from './dto/create-certification-application.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';

@Injectable()
export class CertificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  types() {
    return this.prisma.certificationType.findMany({ orderBy: { name: 'asc' } });
  }

  createApplication(applicantId: string, dto: CreateCertificationApplicationDto) {
    return this.prisma.certificationApplication.create({
      data: {
        applicantId,
        typeId: dto.typeId,
        farmId: dto.farmId,
        formData: (dto.formData ?? {}) as Prisma.InputJsonValue,
        documents: (dto.documents ?? []) as Prisma.InputJsonValue,
        status: dto.submit
          ? CertificationApplicationStatus.SUBMITTED
          : CertificationApplicationStatus.DRAFT,
        submittedAt: dto.submit ? new Date() : undefined
      },
      include: { type: true, farm: true }
    });
  }

  applications(user: AuthenticatedUser) {
    const canReview = user.roles.some((role) =>
      ['ADMIN', 'GOV', 'NGO', 'SUPER_ADMIN'].includes((role as any).name)
    );
    return this.prisma.certificationApplication.findMany({
      where: canReview ? {} : { applicantId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        type: true,
        farm: true,
        applicant: { select: { id: true, displayName: true } },
        inspections: true,
        certificate: true
      }
    });
  }

  createInspection(applicationId: string, dto: CreateInspectionDto) {
    return this.prisma.certificationInspection.create({
      data: {
        applicationId,
        inspectorId: dto.inspectorId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        checklist: (dto.checklist ?? {}) as Prisma.InputJsonValue,
      }
    });
  }

  async issueCertificate(ownerId: string, applicationId: string) {
    const application = await this.prisma.certificationApplication.findUnique({
      where: { id: applicationId },
      include: { type: true, farm: true, certificate: true }
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.certificate) return application.certificate;
    if (!['APPROVED', 'UNDER_REVIEW', 'SUBMITTED'].includes(application.status)) {
      throw new BadRequestException('Application is not ready for issuance');
    }

    const certificateNo = `FJ-FARM-${Date.now()}`;
    const qrToken = randomBytes(24).toString('base64url');
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt);
    expiresAt.setMonth(expiresAt.getMonth() + application.type.validityMonths);
    const verifyUrl = `/api/certification/certificates/${qrToken}/verify`;
    const pdf = await this.renderCertificatePdf({
      certificateNo,
      farmName: application.farm.name,
      typeName: application.type.name,
      verifyUrl
    });
    const uploaded = await this.storage.putObject({
      folder: 'farm-certificates',
      filename: `${certificateNo}.pdf`,
      contentType: 'application/pdf',
      body: pdf
    });

    return this.prisma.$transaction(async (tx) => {
      const certificate = await tx.farmCertificate.create({
        data: {
          applicationId,
          farmId: application.farmId,
          ownerId: application.applicantId,
          certificateNo,
          qrToken,
          pdfUrl: uploaded.publicUrl ?? uploaded.objectKey,
          issuedAt,
          expiresAt,
          metadata: { issuedBy: ownerId }
        }
      });
      await tx.certificationApplication.update({
        where: { id: applicationId },
        data: { status: 'ISSUED' }
      });
      return certificate;
    });
  }

  async verify(qrToken: string) {
    const certificate = await this.prisma.farmCertificate.findUnique({
      where: { qrToken },
      include: {
        farm: true,
        owner: { select: { id: true, displayName: true } },
        application: { include: { type: true } }
      }
    });
    if (!certificate) throw new NotFoundException('Certificate not found');
    return certificate;
  }

  private async renderCertificatePdf(input: {
    certificateNo: string;
    farmName: string;
    typeName: string;
    verifyUrl: string;
  }) {
    const qr = await QRCode.toBuffer(input.verifyUrl, { type: 'png', width: 180 });
    const doc = new PDFDocument({ size: 'A4', margin: 72 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(26).text('FarmJumnoy Farm Certificate', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(18).text(input.typeName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(24).text(input.farmName, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Certificate No: ${input.certificateNo}`, { align: 'center' });
    doc.image(qr, doc.page.width / 2 - 60, doc.y + 24, { width: 120 });
    doc.end();
    return done;
  }
}
