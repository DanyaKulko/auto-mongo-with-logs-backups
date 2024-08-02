import logger from "./utils/logger";
import { awaitShell } from "./utils/await-shell";
import path from "node:path";
import { rm } from "node:fs/promises";
import { sendTelegramFile } from "./utils/sendTelegramMessage";
import { config } from "./config";
import type { Project } from "./utils/readExportData";

export const exportData = async (project: Project) => {
    const projectLogger = logger.child({ label: project.title });

    projectLogger.info(`Export for project "${project.title}" started`);

    if (project.mongo?.enabled) {
        const mongoDumpFileName = new Date().toISOString();
        const fullDumpPath = path.join(
            config.DUMPS_DIR,
            project.hashtag,
            "mongo",
            mongoDumpFileName,
        );
        projectLogger.info(`Exporting mongo data to ${fullDumpPath}`);
        try {
            await awaitShell(
                `mongodump --uri=${project.mongo.url} --out=${fullDumpPath}`,
            );

            await awaitShell(
                `tar -czf ${fullDumpPath}.tar.gz -C $(dirname ${fullDumpPath}) $(basename ${fullDumpPath})`,
            );
            await rm(fullDumpPath, { recursive: true, force: true });

            await sendTelegramFile(
                project.chat_id,
                project.message_thread_id,
                `${fullDumpPath}.tar.gz`,
                project.hashtag,
                "Mongo",
            );
            projectLogger.info("Mongo data exported");

            if (project.mongo.removeAfterExport) {
                projectLogger.info("Removing mongo dump");
                await rm(fullDumpPath);
                projectLogger.info("Mongo dump removed");
            }
        } catch (error) {
            projectLogger.error(
                `Error exporting mongo data: ${JSON.stringify(error)}`,
            );
        }
    }

    if (project.logs?.enabled) {
        const logsFileName = new Date().toISOString();
        const fullOutputLogsPath = path.join(
            config.DUMPS_DIR,
            project.hashtag,
            "logs",
            logsFileName,
        );
        const inputLogsDir = project.logs.path;
        projectLogger.info(
            `Exporting logs from ${inputLogsDir} to ${fullOutputLogsPath}`,
        );
        try {
            const findCommand = `find ${inputLogsDir} -type f ! -name ".*.json" -printf '%T@ %p\n' | sort -n | tail -n ${project.logs.lastModifiedFilesCount} | cut -d' ' -f2-`;

            const res = (await awaitShell(findCommand)) as string;
            const filesToArchive = res
                .split("\n")
                .filter((file) => file.trim() !== "")
                .map(
                    (file) =>
                        `--transform 's,^./,,' ${path.relative(inputLogsDir, file)}`,
                )
                .join(" ");

            if (!filesToArchive) {
                projectLogger.info("No files to archive.");
                return;
            }

            const tarCommand = `tar -czf ${fullOutputLogsPath}.tar.gz -C ${inputLogsDir} ${filesToArchive}`;
            await awaitShell(tarCommand);

            await sendTelegramFile(
                project.chat_id,
                project.message_thread_id,
                fullOutputLogsPath,
                project.hashtag,
                "Logs",
            );
            projectLogger.info("Logs exported");

            if (project.logs.removeAfterExport) {
                projectLogger.info("Removing mongo dump");
                await rm(fullOutputLogsPath);
                projectLogger.info("Mongo dump removed");
            }
        } catch (error) {
            projectLogger.error(
                `Error exporting logs: ${JSON.stringify(error)}`,
                error,
            );
        }
    }

    projectLogger.info(`Export for project "${project.title}" finished`);
};
