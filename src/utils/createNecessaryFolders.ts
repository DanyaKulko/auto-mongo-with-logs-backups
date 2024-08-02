import { access, mkdir } from "node:fs/promises";
import { F_OK } from "node:constants";
import { config } from "../config";
import logger from "./logger";
import type { Project } from "./readExportData";
import path from "node:path";

export const createNecessaryFolders = async (projects: Project[]) => {
    const foldersLogger = logger.child({ label: "folders creation" });

    const createDirIfNotExists = async (dir: string) => {
        try {
            await access(dir, F_OK);
        } catch (err: any) {
            if (err.code === "ENOENT") {
                foldersLogger.info(`Creating directory ${dir}`);
                await mkdir(dir, { recursive: true });
            } else {
                throw err;
            }
        }
    };

    const pathsToCreate = new Set<string>();

    pathsToCreate.add(config.DUMPS_DIR);

    for (const project of projects) {
        if (project.logs?.enabled) {
            pathsToCreate.add(
                path.join(config.DUMPS_DIR, project.hashtag, "logs"),
            );
        }
        if (project.mongo?.enabled) {
            pathsToCreate.add(
                path.join(config.DUMPS_DIR, project.hashtag, "mongo"),
            );
        }
    }

    await Promise.all(Array.from(pathsToCreate).map(createDirIfNotExists));
};
