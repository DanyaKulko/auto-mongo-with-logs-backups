import dotenv from "dotenv";
dotenv.config();

interface Config {
    NODE_ENV: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: number;
    PROJECTS_DATA_FILE_NAME: string;
    EXPORT_CRON_SCHEDULE: string;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
    TELEGRAM_CHAT_ID: +(process.env.TELEGRAM_CHAT_ID || "0"),
    PROJECTS_DATA_FILE_NAME: process.env.PROJECTS_DATA_FILE_NAME || "",
    EXPORT_CRON_SCHEDULE: process.env.EXPORT_CRON_SCHEDULE || "0 0 * * *",
};
