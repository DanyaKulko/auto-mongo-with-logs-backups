module.exports = {
    apps: [
        {
            name: "Mongo+Logs Backups",
            env_production: {
                NODE_ENV: "production",
            },
            script: "dist/index.js"
        },
    ],
};
