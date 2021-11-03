import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

@Injectable()
export class EmailService {
    private readonly logger = new Logger("EmailService");

    constructor(
        private configService: ConfigService,
    ) {}

    getEmailBody (options, templatePath = "./template/email.html") {
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
                user: this.configService.get<string>("smtp_email_user"),
                pass: this.configService.get<string>("smtp_email_pass")
            },
        });
        return transporter;
    }

    async sendEmail(to, subject, text, templateOptions, templatePath) {
        const transporter = await this.createTransport();
        const html = this.getEmailBody(templateOptions, templatePath);
        const from = this.configService.get<string>("smtp_email_user")
        console.log(from);
        this.logger.log(`Sending e-mail to ${to} ...`);
        const emailResult = await transporter.sendMail({ from, to, subject, text, html })//.then(() => transporter.close());
        console.log(emailResult);
        return emailResult;
    }
}
