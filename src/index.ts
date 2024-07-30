import { exportData } from "./export";
import { readExportData } from "./utils/readExportData";
import cron from "node-cron";
import logger from "./utils/logger";
import { createNecessaryFolders } from "./utils/createNecessaryFolders";

const start = async () => {
    createNecessaryFolders();
    try {
        const projects = await readExportData();
        await exportData(projects);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error exporting data: ${error.message}`);
        }
    }
};

cron.schedule("0 0 * * *", start);

start();
