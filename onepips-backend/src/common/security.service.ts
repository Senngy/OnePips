import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SecurityService implements OnModuleInit {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.validateSuperAdminState();
  }

  /**
   * Vérifie qu'il existe exactement 1 SUPER_ADMIN
   *
   * Si 0 ou >1, le serveur refuse de démarrer
   * Cela garantit l'intégrité du modèle de sécurité
   */
  async validateSuperAdminState(): Promise<void> {
    try {
      const count = await this.prisma.superAdmin.count();

      if (count === 0) {
        this.logger.error(
          'SECURITY ERROR: No SUPER_ADMIN found. Run: npm run create-super-admin',
        );
        process.exit(1);
      }

      if (count > 1) {
        this.logger.error(
          `SECURITY ERROR: Multiple SUPER_ADMIN found (${count}). Database integrity compromised.`,
        );
        process.exit(1);
      }

      this.logger.log('✅ SUPER_ADMIN state validated: exactly 1 found');
    } catch (error) {
      this.logger.error(
        `SECURITY ERROR: Failed to validate SUPER_ADMIN state`,
        error,
      );
      process.exit(1);
    }
  }
}
