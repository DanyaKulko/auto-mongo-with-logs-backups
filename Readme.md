## Auto Mongo and Logs Backup

### Small utility to back up mongo databases and logs using cron with sending dumps to Telegram. 

 - Mongo backup is using [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) utility which is included in MongoDB Database Tools.
 - Logs backup is using [tar](https://www.gnu.org/software/tar/) utility.

All backups are stored in the `dumps` directory in the root of the project.
Each project has its own cron schedule for exporting data.


### Configuration

The script is using the `.env` file to get the configuration. The `.env` file should look like this:

```env
TELEGRAM_BOT_TOKEN=...

# File name with projects data (in data folder)
PROJECTS_DATA_FILE_NAME=projects_example.json
```

The `projects_example.json` file should look like this:

```json
{
  "projects": [
    {
      "title": "Project Example",
      "hashtag": "projectExample",
      "chat_id": -1000000,
      "message_thread_id": 0,
      "cron": "0 0 * * *",
      "mongo": {
        "enabled": true,
        "url": "mongodb://username:password@127.0.0.1:27017/project",
        "removeAfterExport": false
      },
      "logs": {
        "enabled": true,
        "path": "/home/projects/projectExample/logs",
        "lastModifiedFilesCount": 2,
        "removeAfterExport": true
      }
    },
    {
      "title": "Project Example2",
      "hashtag": "projectExample2",
      "chat_id": -2000000,
      "cron": "0 0 0 * *",
      "mongo": {
        "enabled": true,
        "url": "mongodb://username:password@127.0.0.1:27017/project2",
        "removeAfterExport": false
      },
      "logs": {
        "enabled": true,
        "path": "/home/projects/projectExample2/logs",
        "lastModifiedFilesCount": 2,
        "removeAfterExport": true
      }
    }
  ]
}
```

### Quick start

1. `git clone https://github.com/DanyaKulko/auto-mongo-with-logs-backups.git`
2. `npm install`
3. Rename the `.env.example` to `.env` and fill it with your data
4. Rename the data/`projects_example.json` to data/`projects.json` and fill it with your data
5. `npm run build`
6. `npm start`

It also can be run using pm2: `pm2 startOrRestart ecosystem.config.js` and`pm2 startOrRestart ecosystem.config.js --env production` for production mode.
