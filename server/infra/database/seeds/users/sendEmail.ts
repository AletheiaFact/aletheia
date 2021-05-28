const nodemailer = require("nodemailer");
const key = require(process.env.GOOGLE_CREDENTIALS_GMAIL_SMTP);
// const key = require("/Users/mateus-wmf/Downloads/aletheia-opentesseract-48fa77a5ff20.json");
const handlebars = require("handlebars");
const fs = require("fs");
const FROM_EMAIL = process.env.FROM_EMAIL;
const path = require("path");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: FROM_EMAIL,
        serviceClient: key.client_id,
        privateKey: key.private_key,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.verify();
        return transporter.sendMail({
            from: FROM_EMAIL,
            to,
            subject,
            text: getEmailtText(),
            html,
        });
    } catch (e) {
        console.error(e);
        return null;
    }
};

const getEmailBody = (email, password, templatePath = "./email.html") => {
    const html = fs.readFileSync(path.resolve(__dirname, templatePath), {
        encoding: "utf-8",
    });
    const template = handlebars.compile(html);
    return template({
        email,
        password,
        baseUrl: process.env.WEB_URL,
    });
};

const getEmailtText = () => {
    return "Voce podera acessar o sistema usando as credenciais abaixo";
};

const getEmailSubject = () => {
    return "Bem-vinda(o) a Aletheia";
};

module.exports = {
    sendEmail,
    getEmailBody,
    getEmailSubject,
};
