import dotenv from "dotenv";
import path from "node:path";
import { getRootPath } from "../utils/getRootPath";
dotenv.config();

interface Config {
    NODE_ENV: string;
    TELEGRAM_BOT_TOKEN: string;
    PROJECTS_DATA_FILE_NAME: string;
    MONGO_DUMP_DIR: string;
    LOGS_DUMP_DIR: string;
}

export const config: Config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
    PROJECTS_DATA_FILE_NAME: process.env.PROJECTS_DATA_FILE_NAME || "",
    MONGO_DUMP_DIR: path.join(getRootPath(), "dumps", "mongo"),
    LOGS_DUMP_DIR: path.join(getRootPath(), "dumps", "logs"),
};
