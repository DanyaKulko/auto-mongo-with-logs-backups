import { access, mkdir } from "node:fs/promises";
import { F_OK } from "node:constants";
import { config } from "../config";
import logger from "./logger";

export const createNecessaryFolders = async () => {
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

    await Promise.all([
        createDirIfNotExists(config.MONGO_DUMP_DIR),
        createDirIfNotExists(config.LOGS_DUMP_DIR),
    ]);
};
