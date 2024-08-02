import { exportData } from "./export";
import { readExportData } from "./utils/readExportData";
import cron from "node-cron";
import logger from "./utils/logger";
import { createNecessaryFolders } from "./utils/createNecessaryFolders";

(async () => {
    const mainLogger = logger.child({ label: "main" });

    try {
        const projects = await readExportData();
        await createNecessaryFolders(projects);

        for (const project of projects) {
            mainLogger.info(
                `Cron set for project "${project.title}" (${project.cron})`,
            );

            cron.schedule(project.cron, async () => {
                await exportData(project);
            }, {
                timezone: "Europe/Kiev",
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error exporting data: ${error.message}`);
        }
    }
})();
