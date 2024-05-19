# Discord Bot

Discord bot for our server

## Architecture

Entry point is `main.js`. This script sets up and runs the bot client. Commands the bot accepts are defined in `/commands`. Each command should be a directory of the command name that has a `.js` file with the same name. The handlers for events we listen to are defined in `/handers` with each handler in its own file of the same name. These directories use `index.js` files to aggregate their contents.

Modules create their own named logger using the `debug` library. Which logs are output is determined by the `DEBUG=` env var. `DEBUG=*` would output all logs, while `DEBUG=main,-commands:*` would show logs for the `main` namespace, but not for any of the namespaces prefixed with `commands:`

So far the only tests are more unit-based. Keep them near what they're testing by using the same file name but with a *.test.js file extension. 

## Installation
- You'll need to have `node` installed.
- Download this repository
- Create and fill out `.env`:
```bash
cp .env-example .env
```
- Install dependencies:
```bash
npm install
```

## Developing
- Running `npm run dev` will start the app using `nodemon` which will watch for changes and restart when detected.
  - Note that changing env vars will not restart the app. You'll need to manually restart in this case.
- You can also run `npm run start` or `node main.js`, but would need to manually restart the app to load the latest changes.

### Notes
- This is a pretty barebones node project using ESM.
- You'll need to specify file extension on imports.
- No formatting -- just rely on Prettier
