"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const env_1 = require("./env");
const transport = nodemailer_1.default.createTransport({
    service: "gmail", // Gmail হলে host/port auto set হবে
    auth: {
        user: env_1.envVers.EMAIL_SENDER.SMTP_USER,
        pass: env_1.envVers.EMAIL_SENDER.SMTP_PASS, // Gmail App Password দিতে হবে
    },
});
const sendEmail = async ({ to, subject, templateName, templateData, attachments, }) => {
    try {
        const templatePath = path_1.default.resolve(__dirname, "templates", `${templateName}.ejs`);
        const html = await ejs_1.default.renderFile(templatePath, templateData);
        const info = await transport.sendMail({
            from: env_1.envVers.EMAIL_SENDER.SMTP_USER,
            to,
            subject,
            html,
            attachments: attachments?.map((item) => ({
                filename: item.filename,
                content: item.content,
                contentType: item.contentType,
            })),
        });
        console.log(`/21131/ Email sent to ${to} : ${info.messageId}`);
    }
    catch (error) {
        console.error("Email Error:", error); // আসল error দেখাবে
        throw new AppError_1.default(400, "Email send failed.");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map