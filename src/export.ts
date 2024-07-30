import logger from "./utils/logger";
import { awaitShell } from "./utils/await-shell";
import path from "node:path";
import { rm } from "node:fs/promises";
import { sendTelegramFile } from "./utils/sendTelegramMessage";
import { config } from "./config";
import { getRootPath } from "./utils/getRootPath";
import type { Project } from "./utils/readExportData";

const dumpsDir = path.join(getRootPath(), "dumps");

export const exportData = async (projects: Project[]) => {
    for (const project of projects) {
        const projectLogger = logger.child({ label: project.title });

        projectLogger.info(
            `Exporting started, mongo export ${project.mongo?.enabled ? "enabled" : "disabled"}, logs export ${project.logs?.enabled ? "enabled" : "disabled"}`,
        );

        if (project.mongo?.enabled) {
            const mongoDumpFileName = `mongo-${project.title.replaceAll(" ", "_")}-${new Date().toISOString()}.gz`;
            const fullDumpPath = path.join(
                dumpsDir,
                "mongo",
                mongoDumpFileName,
            );
            projectLogger.info(`Exporting mongo data to ${fullDumpPath}`);
            try {
                await awaitShell(
                    `mongodump --uri=${project.mongo.url} --archive=${fullDumpPath} --gzip`,
                );

                await sendTelegramFile(
                    config.TELEGRAM_CHAT_ID,
                    fullDumpPath,
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
            const logsFileName = `logs-${project.title.replaceAll(" ", "_")}-${new Date().toISOString()}.tar.gz`;
            const fullOutputLogsPath = path.join(
                dumpsDir,
                "logs",
                logsFileName,
            );
            const inputLogsDir = path.join(...project.logs.path.split("/"));
            projectLogger.info(
                `Exporting logs from ${inputLogsDir} to ${fullOutputLogsPath}`,
            );
            try {
                const findCommand = `find ${inputLogsDir} -type f ! -name ".*.json" -printf '%T@ %p\n' | sort -n | tail -n ${project.logs.lastModifiedFilesCount} | cut -d' ' -f2-`;

                const res = (await awaitShell(findCommand)) as string;
                const filesToArchive = res
                    .split("\n")
                    .filter((file) => file.trim() !== "")
                    .join(" ");

                if (filesToArchive.length === 0) {
                    projectLogger.info("No files to archive.");
                    return;
                }

                const tarCommand = `tar -czf ${fullOutputLogsPath} -C ${inputLogsDir} ${filesToArchive
                    .split(" ")
                    .map(
                        (file) =>
                            `--transform 's,^./,,S' ${path.relative(inputLogsDir, file)}`,
                    )
                    .join(" ")}`;

                await awaitShell(tarCommand);

                await sendTelegramFile(
                    config.TELEGRAM_CHAT_ID,
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

        projectLogger.info("Exporting finished");
    }
};
