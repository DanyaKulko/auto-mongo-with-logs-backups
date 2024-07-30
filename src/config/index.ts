import dotenv from "dotenv";
import path from "node:path";
import {getRootPath} from "../utils/getRootPath";
dotenv.config();

interface Config {
    NODE_ENV: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: number;
    PROJECTS_DATA_FILE_NAME: string;
    EXPORT_CRON_SCHEDULE: string;
    MONGO_DUMP_DIR: string;
    LOGS_DUMP_DIR: string;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
    TELEGRAM_CHAT_ID: +(process.env.TELEGRAM_CHAT_ID || "0"),
    PROJECTS_DATA_FILE_NAME: process.env.PROJECTS_DATA_FILE_NAME || "",
    EXPORT_CRON_SCHEDULE: process.env.EXPORT_CRON_SCHEDULE || "0 0 * * *",
    MONGO_DUMP_DIR: path.join(getRootPath(), "dumps", "mongo"),
    LOGS_DUMP_DIR: path.join(getRootPath(), "dumps", "logs"),
};
