import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { LearningService } from './learning.service';

@ApiBearerAuth()
@ApiTags('Learning')
@Controller()
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('courses')
  list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.learningService.listCourses({ q, category, page: Number(page), limit: Number(limit) });
  }

  @Post('courses')
  @Roles(RoleName.EXPERT, RoleName.NGO, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCourseDto) {
    return this.learningService.createCourse(user.id, dto);
  }

  @Get('courses/:id')
  get(@Param('id') id: string) {
    return this.learningService.getCourse(id);
  }

  @Post('courses/:id/enroll')
  enroll(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.learningService.enroll(user.id, id);
  }

  @Post('lessons/:id/complete')
  completeLesson(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: CompleteLessonDto) {
    return this.learningService.completeLesson(user.id, id, dto);
  }

  @Post('quizzes/:id/submit')
  submitQuiz(@Param('id') id: string, @Body() dto: SubmitQuizDto) {
    return this.learningService.submitQuiz(id, dto);
  }

  @Post('courses/:id/certificates')
  issueCertificate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.learningService.issueCertificate(user.id, id);
  }

  @Public()
  @Get('certificates/learning/:id/verify')
  verifyCertificate(@Param('id') id: string) {
    return this.learningService.verifyCertificate(id);
  }
}
