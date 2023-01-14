import type { AuthConfig } from "@ioc:Adonis/Addons/Auth";

const authConfig: AuthConfig = {
  guard: "api",
  guards: {
    api: {
      driver: "oat",

      provider: {
        driver: "lucid",
        identifierKey: "username",
        uids: ["username", "email"],
        model: () => import("App/Models/User"),
      },

      tokenProvider: {
        type: "api",
        driver: "redis",
        redisConnection: "local",
        foreignKey: "username",
      },
    },
  },
};

export default authConfig;
