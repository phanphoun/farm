import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly cdnBaseUrl?: string;

  constructor(config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET', 'farmjumnoy-dev');
    this.cdnBaseUrl = config.get<string>('CDN_BASE_URL') || undefined;
    this.client = new S3Client({
      region: config.get<string>('S3_REGION', 'ap-southeast-1'),
      endpoint: config.get<string>('S3_ENDPOINT') || undefined,
      forcePathStyle: config.get<boolean>('S3_FORCE_PATH_STYLE', false),
      credentials: {
        accessKeyId: config.get<string>('S3_ACCESS_KEY', ''),
        secretAccessKey: config.get<string>('S3_SECRET_KEY', '')
      }
    });
  }

  async createSignedUploadUrl(input: { folder: string; filename: string; contentType: string }) {
    const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectKey = `${input.folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFilename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: input.contentType
    });

    return {
      bucket: this.bucket,
      objectKey,
      uploadUrl: await getSignedUrl(this.client, command, { expiresIn: 900 }),
      publicUrl: this.publicUrl(objectKey)
    };
  }

  async putObject(input: {
    folder: string;
    filename: string;
    contentType: string;
    body: Buffer | Uint8Array | string;
  }) {
    const safeFilename = input.filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectKey = `${input.folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFilename}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        ContentType: input.contentType,
        Body: input.body
      })
    );

    return {
      bucket: this.bucket,
      objectKey,
      publicUrl: this.publicUrl(objectKey)
    };
  }

  publicUrl(objectKey: string) {
    if (!this.cdnBaseUrl) return undefined;
    return `${this.cdnBaseUrl.replace(/\/$/, '')}/${objectKey}`;
  }
}
