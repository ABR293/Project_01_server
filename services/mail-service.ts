const nodemailer = require('nodemailer');
// import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

class MailService {
  transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILDEV_INCOMING_HOST,
      port: process.env.MAILDEV_INCOMING_PORT,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: process.env.MAILDEV_INCOMING_USER,
        pass: process.env.MAILDEV_INCOMING_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendActivationMail(mail, link) {
    this.transporter.sendMail({
      from: 'barev9933@gmail.com',
      to: mail,
      subject: 'testTest HTML',
      text: '',
      html: `
            <div>
                <h1>Для активации Аккаунта Перейдите по ссылке</h1>
                <a href='${link}'>${link}</a>
                <h4>Если вы не создавали учетную запись просто проигнорируйте это письмо<h4>
            </div>
            `,
    });
  }
  async sendPasswordResetMail(mail, code) {
    this.transporter.sendMail({
      from: 'barev9933@gmail.com',
      to: mail,
      subject: 'Смена пароля пользователя',
      text: '',
      html: `
            <div>
                <h2>Для смены пароля пользователя введите указанный код</h2>
                <h4>Введите данный код в форму</h4>
                <h1>${code}<h1>
                <h4>Если вы не отправляли запрос проигнорируйте это пиьмо или обратитесь в службу тех поддежки<h4>
                <h4>ВАЖНО!!! не передавайте данный код третьим лицам!!!с<h4>
            </div>
            `,
    });
  }
}
export default new MailService();
