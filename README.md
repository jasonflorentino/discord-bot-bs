# Discord Bot

Discord bot for our server

## Architecture

Entry point is `main.js`. This script sets up and runs the bot client. Commands the bot accepts are defined in `/commands`. Each command should be a directory of the command name that has a `.js` file with the same name. The handlers for events we listen to are defined in `/handers` with each handler in its own file of the same name. These directories use `index.js` files to aggregate their contents.

Modules create their own named logger using the `debug` library. Which logs are output is determined by the `DEBUG=` env var. `DEBUG=*` would output all logs, while `DEBUG=main,-commands:*` would show logs for the `main` namespace, but not for any of the namespaces prefixed with `commands:`
