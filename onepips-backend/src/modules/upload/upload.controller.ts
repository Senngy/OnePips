import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import type { Request, Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission } from '../../../generated/prisma/client.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function ensureUploadDirectory() {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function createSafeFilename(originalName: string, mimeType: string) {
  const extension =
    ALLOWED_MIME_TYPES[mimeType] ?? extname(originalName).toLowerCase();

  const basenameSanitized = basename(originalName, extname(originalName))
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)
    .replace(/(^-|-$)/g, '');

  const randomSuffix = randomBytes(8).toString('hex');

  return `${Date.now()}-${basenameSanitized || 'image'}-${randomSuffix}${extension}`;
}

@Controller()
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  @Get('uploads/:filename')
  serveFile(@Req() req: Request, @Res() res: Response) {
    this.logger.debug('[API] UploadFile - Request params:', req.params); // Log the request parameters for debugging
    // req.params.filename can be string | string[] depending on how params are parsed

    const rawFilename = (req.params as Record<string, any>).filename;

    if (typeof rawFilename !== 'string') {
      throw new BadRequestException({
        code: 'INVALID_UPLOAD_FILENAME',
        message: 'Nom de fichier invalide.',
      });
    }

    const filename = basename(rawFilename);

    if (filename !== rawFilename) {
      this.logger.warn({
        message: 'Rejected upload path traversal attempt',
        method: req.method,
        path: req.originalUrl,
      });
      throw new BadRequestException({
        code: 'INVALID_UPLOAD_FILENAME',
        message: 'Nom de fichier invalide.',
      });
    }

    const uploadRoot = resolve(UPLOAD_DIR);
    const filePath = resolve(uploadRoot, filename);

    if (
      filePath !== uploadRoot &&
      !filePath.startsWith(`${uploadRoot}/`)
    ) {
      this.logger.warn({
        message: 'Rejected upload path outside upload directory',
        method: req.method,
        path: req.originalUrl,
      });

      throw new BadRequestException({
        code: 'INVALID_UPLOAD_PATH',
        message: 'Chemin de fichier invalide.',
      });
    }

    if (!existsSync(filePath)) {
      this.logger.error(`[API] UploadFile - 404 File not found: ${filePath}`); // Log the error for debug
      throw new NotFoundException({
        code: 'UPLOAD_NOT_FOUND',
        message: 'Fichier non trouvé.',
      });
    }
    return res.sendFile(filePath);
  }
  @Post('upload')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.FILES_UPLOAD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureUploadDirectory();
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const filename = createSafeFilename(file.originalname, file.mimetype);
          cb(null, filename);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES[file.mimetype]) {
          return cb(
            new BadRequestException(
              'Format de fichier invalide. Seuls JPG, PNG, WebP et GIF sont acceptés.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException(
        'Aucun fichier reçu. Assurez-vous d’envoyer le champ `file`.',
      );
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/api/uploads/${file.filename}`;

    return { url };
  }
}
