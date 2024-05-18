import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Collection } from "discord.js";

import { getCommands } from "./index.js";
import { errors } from "./getCommands.js";

// node commands/getCommands.test.js
describe("getCommands", async () => {
  it("handles Collection", async () => {
    const result = await getCommands(new Collection());
    assert.ok(result);
  });
  it("handles Array", async () => {
    const result = await getCommands(new Collection());
    assert.ok(result);
  });
  it("throws on no input", async () => {
    assert.rejects(
      async () => {
        await getCommands();
      },
      { message: errors.NO_INPUT },
    );
  });
  it("throws on bad collection", async () => {
    assert.rejects(
      async () => {
        await getCommands("truthy");
      },
      { message: errors.BAD_INPUT },
    );
  });
});
