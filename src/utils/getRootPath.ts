import path from "node:path";

export const getRootPath = (): string => {
    return path.resolve(__dirname, "..", "..");
};
