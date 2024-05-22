# 🤖 Discord Bot

Discord bot for our server

### Contents
- [Architecture](#architecture)
- [Repo setup](#repo-setup)
- [Developing](#developing)
- [Bot Installation](#bot-installation)
- [Deployment](#deployment)
- [Reference](#reference)

## Architecture

Entry point is `main.js`. This script sets up and runs the bot client. [`discord.js`](https://discordjs.guide/) is used to easily interface with the Discord API. The client listens for events from Discord, acts on them with handlers, and if the event is for a `ChatInputCommand`, execute the corresponding command code. Commands the bot accepts are defined in `/commands`. Each command should be a directory of the command name that has a `.js` file with the [same name](https://github.com/jasonflorentino/discord-bot-bs/blob/d622524fa72da0a22a34d6ba01daf8743fb59bfd/commands/getCommands.js#L86-L89). The handlers for events we listen to are defined in `/handers` with each handler in its own file of the same name. These directories use `index.js` files to aggregate their contents.

Environment variables are loaded using the [`dotenv` library](https://github.com/motdotla/dotenv). This is done at the top of the entry file. Keep in mind that if you write scripts separate from the main application, you'll need to import `dotenv` in order to access the env vars.

Modules create their own named logger using the [`debug` library](https://github.com/debug-js/debug). Which logs are output is determined by the `DEBUG=` env var. `DEBUG=*` would output logs from _all_ modules, while `DEBUG=main,-commands:*` would show logs for the `main` namespace, but **not** for any of the namespaces prefixed with `commands:`

So far the only tests are more unit-based. Keep them near what they're testing by using the same filename but with a `*.test.js` file extension. 

## Repo setup 
- You'll need to have `node` installed.
  - Make your life easy and use [`nvm`](https://github.com/nvm-sh/nvm) to install and manage `node` versions
  - Use at least node `v20.13.1`
  - and npm `10.5.2`
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

## Bot Installation

### Introduction
The way I like to think about it (I haven't used Discord or Discord bots much) is that there is a _user_ in Discord's system _sort of_ like any other user: They have a profile picture; they can be added to servers; if you start typing to them they'll "see" an indication that someone is typing. This Discord user is like the front-end of this system. Messages you send, events like "typing" are processed through Discord for this user, but they need to be sent somewhere -- there isn't another Discord client app getting the messages and a person looking at them to respond.

That's where this code comes in. Think of it like the backend of this system. Running the code starts up a client app that can receive and react to the messages and events coming from the Discord frontend. Just like you, it needs to log in first. But once it's online messages from different servers can come in and it can start sending back replies.

So just like creating your account on Discord, we first need to create an account for this bot user. We'll then be able to use a series of secret keys to "log in" and let Discord know where to start sending all the messages for this user. The last part then is to invite our user to a server!

### Creating the bot user
- Go to the Discord Developer Portal: https://discord.com/developers/applications
- Click "New Application" at the top right.
- Give your application (user) a name. You can change this later.
- Submit by clicking "Create"
- You'll now be able to add things like a Profile Picture and stuff.

### Getting env vars
- Under OAuth2 from the left menu, you'll find `Client ID`
- Under Bot from the left menu, you'll find `Token`
- For Guild ID, 
  - you'll first need to enable Develop Mode in Discord: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID
  - Then you can right-click on your server and see the option `Copy Server ID`
  - This ID is what we'll use to add/refresh commands for a specific guild (great for testing)
  - as well as generate invite links to invite the bot to a specific guild

## Deployment
We'll use the [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) process manager to run the app in production. 

### Some useful commands

#### Install pm2
```
npm install pm2@latest -g
```

#### Start the app
```
pm2 start pm2.config.cjs
```

#### Check status of running apps
```
pm2 status
```

#### Tail log files
```
# All logs
pm2 logs

# Just the bot's stdout and stderr
pm2 logs bot --raw
```

#### Restart the app
```
pm2 restart bot

# Restart and update env vars
pm2 restart --update-env
```

#### Kill all apps 
```
pm2 delete all
```

### Deploy changes
Deployment is manual right now: Pull down latest code from remote and restart the app using `pm2 restart bot`

## Reference
- [`discord.js` Guide](https://discordjs.guide/#before-you-begin)
- [`discord.js` API Reference](https://discord.js.org/docs/packages/discord.js/stable#/docs/discord.js/main/general/welcome)
- [Discord API docs](https://discord.com/developers/docs/intro)