import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

@Injectable()
export class EmailService {
    private readonly logger = new Logger("EmailService");

    constructor(private configService: ConfigService) {}

    getEmailBody(options, templatePath = "./template/email.html") {
        const html = fs.readFileSync(path.resolve(__dirname, templatePath), {
            encoding: "utf-8",
        });
        const template = handlebars.compile(html);
        return template({
            ...options,
            baseUrl: this.configService.get<string>("web_url"),
        });
    }

    async createTransport() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>("smtp_host"),
            port: this.configService.get<string>("smtp_port"),
            secure: this.configService.get<string>("smtp_secure"),
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_ADDRESS,
                clientId: process.env.SMTP_CLIENT_ID,
                clientSecret: process.env.SMTP_CLIENT_SECRET,
                refreshToken: process.env.SMTP_REFRESH_TOKEN,
            },
        });
        return transporter;
    }

    async sendEmail(to, subject, text, templateOptions, templatePath) {
        const transporter = await this.createTransport();
        const html = this.getEmailBody(templateOptions, templatePath);
        const from = this.configService.get<string>("smtp_email_user");
        this.logger.log(`Sending e-mail to ${to} ...`);
        const emailResult = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        }); //.then(() => transporter.close());
        return emailResult;
    }
}
