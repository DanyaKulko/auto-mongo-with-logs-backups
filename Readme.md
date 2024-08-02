# Auto Mongo and Logs Backup

## Overview

This script is used to automate the process of exporting MongoDB data and logs backups to Telegram.

It creates an archive with MongoDB data and logs and sends it to the Telegram chat.

- Mongo backup is using [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) utility which is included in
  MongoDB Database Tools.
- Logs backup is using [tar](https://www.gnu.org/software/tar/) utility.

It can be easily modified to send backups to other services like AWS S3, Google Cloud Storage, etc.

Also, if your archived backups are more than 50MB, consider using other services since Telegram has a 50MB limit for files.

All backups are stored in the `dumps` directory in the root of the project.

Each project has its own backup folder and cron schedule for exporting data.

Dumps folder example structure:

```
dumps
├── projectExample
│   ├── logs
│   │   └── 2024-08-02T01:37:58.518Z.tar 
│   └── mongo
│       └── 2024-08-02T01:37:58.518Z
├── projectExample2
│   └── logs
│       └── 2024-08-02T01:37:58.518Z.tar
└── projectExample3
    └── mongo
        └── 2024-08-02T01:37:58.518Z
```

## Configuration

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

### Annotation:

- `title` - project title(used only for logs)
- `hashtag` - project hashtag(used for creating a folder with backups and hashtag for telegram messages)
- `chat_id` - telegram chat id
- `message_thread_id` - telegram message thread id(optional)
- `cron` - cron schedule for exporting data
- `mongo` - mongo backup configuration
    - `enabled` - enable mongo backup
    - `url` - mongo connection string
    - `removeAfterExport` - remove backup archive after exporting
- `logs` - logs backup configuration
- `enabled` - enable logs backup
- `path` - path to logs folder
- `lastModifiedFilesCount` - count of last modified files to back up
- `removeAfterExport` - remove backup archive after exporting

## Quick start

1. `git clone https://github.com/DanyaKulko/auto-mongo-with-logs-backups.git`
2. `npm install`
3. Rename the `.env.example` to `.env` and fill it with your data
4. Rename the data/`projects_example.json` to data/`projects.json` and fill it with your data
5. `npm run build`
6. `npm start`

It also can be run using pm2: `pm2 start ecosystem.config.js`
and`pm2 start ecosystem.config.js --env production` for production mode.
