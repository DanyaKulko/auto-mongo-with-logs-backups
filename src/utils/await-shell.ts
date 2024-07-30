import { exec } from "node:child_process";

export const awaitShell = (cmd: string) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return reject({error, stderr});
            }
            resolve(stdout);
        });
    });
};
