import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomEmailTemplate } from "./emailTemplates.js";

export const sendWelcomEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcom to Linkedin clone API",
            html: createWelcomEmailTemplate(name, profileUrl),
            category: "welcom"
        })

        console.log("Welcome Email sent succesffully", response);
    } catch (error) {
        throw error
    }
}
