import { readFile } from "node:fs/promises";
import { config } from "../config";
import path from "node:path";
import { getRootPath } from "./getRootPath";

export interface Project {
    title: string;
    hashtag: string;
    chat_id: number;
    message_thread_id?: number;
    cron: {
        schedule: string;
        timezone?: string;
    };
    mongo?: {
        enabled: boolean;
        url: string;
        removeAfterExport?: boolean;
    };
    logs?: {
        enabled: boolean;
        path: string;
        lastModifiedFilesCount: number;
        removeAfterExport?: boolean;
    };
}

export const readExportData = async (): Promise<Project[]> => {
    const fileDataPath = path.join(
        getRootPath(),
        "data",
        config.PROJECTS_DATA_FILE_NAME,
    );
    const data = await readFile(fileDataPath, "utf-8");

    return JSON.parse(data) as Project[];
};
