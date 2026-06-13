import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Query, Get, Res, StreamableFile, Header, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { join } from 'node:path';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');

@Controller('media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 25 * 1024 * 1024 },
      fileFilter: (_req: any, file: { mimetype: string; originalname: string }, callback: any) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm'];
        if (allowed.includes(file.mimetype)) return callback(null, true);
        return callback(new Error(`unsupported file type ${file.mimetype}`), false);
      },
    }),
  )
  upload(@UploadedFile() file: any, @Query('folder') folder = 'social') {
    if (!file) throw new BadRequestException('file is required');
    const targetDir = join(UPLOAD_ROOT, folder);
    mkdirSync(targetDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const fullPath = join(targetDir, filename);
    require('node:fs').writeFileSync(fullPath, file.buffer);

    const appUrl = process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 4001}`;
    const url = `${appUrl}/uploads/${folder}/${filename}`;
    return { url, type: file.mimetype.startsWith('video/') ? 'video' : 'image', filename, folder };
  }

  @Get('serve/:folder/:filename')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  serve(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    const fullPath = join(UPLOAD_ROOT, folder, filename);
    if (!existsSync(fullPath)) return res.status(404).send('Not found');
    const stream = createReadStream(fullPath);
    res.set({
      'Content-Type': ({
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4',
        '.webm': 'video/webm'
      }[extname(filename).toLowerCase()] ?? 'application/octet-stream'),
      'Content-Length': statSync(fullPath).size,
    });
    return new StreamableFile(stream);
  }
}
