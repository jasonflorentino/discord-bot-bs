import { DiscordAPIError } from "discord.js";

export const Messages = {
  Generic:
    "Uh oh! Something went wrong when trying to execute this command. Please try again later or let an admin know.",
  Permissions:
    "Sorry, we don't have permission to do that. Please contact on admin.",
};

export function getReply(err) {
  if (err instanceof DiscordAPIError) {
    switch (err.message) {
      case "Missing Permissions":
        return Messages.Permissions;
    }
  }
  return Messages.Generic;
}
