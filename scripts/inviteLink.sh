#!/usr/bin/env bash

# Generate an invite link for the bot
# Run with:
#   ./scripts/inviteLink.sh
# Or:
#   npm run invite

PERMS='&permissions=0&scope=bot%20applications.commands'
CLIENTID="$(cat .env | grep DISCORD_CLIENT_ID | cut -f 2 -d =)" 

if [[ -z $CLIENTID ]]
then
 echo "ERROR: No client ID! Check ./.env for DISCORD_CLIENT_ID"
else
  echo https://discord.com/api/oauth2/authorize?client_id=$CLIENTID$PERMS
fi 
