import { describe, expect, it } from "vitest";
import { showNameUser } from "./index";

const me = { _id: "1", name: "Me" };
const alice = { _id: "2", name: "Alice" };
const bob = { _id: "3", name: "Bob" };

describe("showNameUser", () => {
  it("returns the other member's name in a two-person room", () => {
    expect(showNameUser([me, alice], me)).toBe("Alice");
    expect(showNameUser([alice, me], me)).toBe("Alice");
  });

  it("joins the other members' names with ', ' in a group", () => {
    expect(showNameUser([me, alice, bob], me)).toBe("Alice, Bob");
  });

  it("compares ids via toString (e.g. ObjectId-like values)", () => {
    const objId = (v) => ({ toString: () => v });
    const users = [
      { _id: objId("1"), name: "Me" },
      { _id: objId("2"), name: "Alice" },
    ];
    expect(showNameUser(users, { _id: objId("1") })).toBe("Alice");
  });

  it("returns '' when the other member cannot be found", () => {
    expect(showNameUser([me, me], me)).toBe("");
  });

  it("returns '' when a member has no _id", () => {
    expect(showNameUser([me, { name: "Ghost" }], me)).toBe("");
    expect(showNameUser([me, alice, { name: "Ghost" }], me)).toBe("");
    expect(showNameUser([me, null], me)).toBe("");
  });

  it("returns '' when the current user is missing or has no _id", () => {
    expect(showNameUser([me, alice], null)).toBe("");
    expect(showNameUser([me, alice], undefined)).toBe("");
    expect(showNameUser([me, alice], { name: "Me" })).toBe("");
  });

  it("returns '' when users is not an array", () => {
    expect(showNameUser(undefined, me)).toBe("");
    expect(showNameUser(null, me)).toBe("");
  });

  it("returns '' when the other member has no name", () => {
    expect(showNameUser([me, { _id: "2" }], me)).toBe("");
  });
});
