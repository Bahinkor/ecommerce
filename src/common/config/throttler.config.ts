import type { ThrottlerModuleOptions } from "@nestjs/throttler";

export const throttlerConfigOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60,
      limit: 10,
    },
  ],
};
