
const nodemailer = require('nodemailer')
require("dotenv").config()

class MailService{
    transporter: any

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.MAILDEV_INCOMING_HOST,
            port:  process.env.MAILDEV_INCOMING_PORT,
            ignoreTLS: false,
            secure: false,
            auth: {
                user: process.env.MAILDEV_INCOMING_USER,
                pass: process.env.MAILDEV_INCOMING_PASS,
            },
            tls: {rejectUnauthorized: false}
        })
    }


    async sendActivationMail(mail, link){
        this.transporter.sendMail({
            from: 'barev9933@gmail.com',
            to: mail,
            subject:'testTest HTML',
            text: '',
            html:`
            <div>
                <h1>Для активации Аккаунта Перейдите по ссылке</h1>
                <a href='${link}'>${link}</a>
                <h4>Если вы не создавали учетную запись просто проигнорируйте это письмо<h4>
            </div>
            `
        })
    }
}

module.exports = new MailService()

