# Discord Bot

Discord bot for our server

## Architecture

Entry point is `main.js`. This script sets up and runs the bot client. [`discord-js`](https://discordjs.guide/) is used to easily interface with the Discord API. Commands the bot accepts are defined in `/commands`. Each command should be a directory of the command name that has a `.js` file with the same name. The handlers for events we listen to are defined in `/handers` with each handler in its own file of the same name. These directories use `index.js` files to aggregate their contents.

Environment variables are loaded using the [`dotenv` library](https://github.com/motdotla/dotenv). This is done at the top of the entry file. Keep in mind that if you write scripts separate from the main application, you'll need to import `dotenv` in order to access the env vars.

Modules create their own named logger using the [`debug` library](https://github.com/debug-js/debug). Which logs are output is determined by the `DEBUG=` env var. `DEBUG=*` would output logs from _all_ modules, while `DEBUG=main,-commands:*` would show logs for the `main` namespace, but **not** for any of the namespaces prefixed with `commands:`

So far the only tests are more unit-based. Keep them near what they're testing by using the same filename but with a `*.test.js` file extension. 

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
  - `nodemon` config is done in `package.json` 
- You can also run `npm run start` or `node main.js`, but would need to manually restart the app to load the latest changes.
- When the app starts up it "logs in" as the bot user to Discord. This process is what creates the connection between someone writing a command to the bot in Discord and that command being sent to wherever this application is running.

### Notes
- This is a pretty barebones node project using ESM.
- You'll need to specify file extension on imports.
- No formatting -- just rely on Prettier
- Bot commands get "registered" with Discord. This process is what allows, for example, suggestions to appear for what commands are available. You only need to re-register a command when something about its configuration changes: Name, description, parameters. Changing the code for how the command executes (ie. The code this application runs in response to the command) does not warrant a registration "update". 

## Reference
- [`discord-js` Guide](https://discordjs.guide/#before-you-begin)
- [`discord-js` API Reference](https://discord.js.org/docs/packages/discord.js/stable#/docs/discord.js/main/general/welcome)