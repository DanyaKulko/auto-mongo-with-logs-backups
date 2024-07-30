module.exports = {
    apps: [
        {
            name: "Mongo+Logs Backups",
            env: {
                NODE_ENV: "production",
            },
            script: "dist/index.js"
        },
    ],
};
