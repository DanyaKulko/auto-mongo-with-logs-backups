import { config } from "../config";
import axios from "axios";
import * as fs from "node:fs";
import FormData from "form-data";
import logger from "./logger";

export const sendTelegramFile = async (
    chatId: number,
    message_thread_id: number | undefined,
    filePath: string,
    hashtag: string,
    type: "Mongo" | "Logs",
) => {
    try {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        if(message_thread_id) {
            formData.append("message_thread_id", message_thread_id);
        }
        formData.append("document", fs.createReadStream(filePath));
        formData.append(
            "caption",
            `#${type} backup for #${hashtag} project`,
        );

        await axios.post(
            `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendDocument`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            },
        );
    } catch (error: any) {
        logger.error(
            `Error sending Telegram archive files: ${error}`,
            error.response.data.description,
        );
    }
};
