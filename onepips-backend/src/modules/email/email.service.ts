import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT || 1025),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });
  }
  return transporter;
}

export class EmailService {
  async send(input: SendEmailInput): Promise<void> {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || 'OnePips <no-reply@onepips.local>',
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}

export const emailService = new EmailService();
