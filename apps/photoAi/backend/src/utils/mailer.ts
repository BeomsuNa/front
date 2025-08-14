import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth : {
        user : process.env.SMTP_USER, 
        pass : process.env.SMTP_PASS
    }
} as SMTPTransport.Options);