import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService {
    readonly transporter = nodemailer.createTransport({
        service: 'gmail', // o 'hotmail', etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendResetPasswordEmail(to: string, token: string) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        const mailOptions = {
            from: '"Soporte" <333xxyy333@gmail.com>',
            to,
            subject: 'Recuperación de contraseña',
            html: `
        <p>Hola,</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">Recuperar contraseña</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
