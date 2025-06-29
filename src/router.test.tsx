import { describe, it, expect } from "vitest";
import { router } from "./router";

describe("router", () => {
  it("should be defined", () => {
    expect(router).toBeDefined();
  });

  it("should have a routeTree property", () => {
    expect(router.options.routeTree).toBeDefined();
  });

  it("should have defaultPreload set to 'intent'", () => {
    expect(router.options.defaultPreload).toBe("intent");
  });
});
