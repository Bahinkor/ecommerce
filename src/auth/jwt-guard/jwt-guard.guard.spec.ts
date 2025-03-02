import { JwtAuthGuard } from "./jwt-guard.guard";

describe("JwtAuthGuard", () => {
  it("should be defined", () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
