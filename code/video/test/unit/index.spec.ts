import { expect, test, vi } from "vitest";
import { helloWorld } from "../../src/index.js";

test("should output hello world", async () => {
  const spy = vi.spyOn(console, "log")
  spy.mockImplementation(() => {})

  helloWorld()

  expect(spy).toBeCalledTimes(1)
})