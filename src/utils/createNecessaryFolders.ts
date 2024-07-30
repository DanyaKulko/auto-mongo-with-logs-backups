import { existsSync, mkdir } from "node:fs";
import { config } from "../config";

export const createNecessaryFolders = () => {
    if (!existsSync(config.MONGO_DUMP_DIR)) {
        mkdir(config.MONGO_DUMP_DIR, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!existsSync(config.LOGS_DUMP_DIR)) {
        mkdir(config.LOGS_DUMP_DIR, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
};
