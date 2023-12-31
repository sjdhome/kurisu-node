import { pino } from "pino";

const logger =
  process.env.NODE_ENV === "development"
    ? pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      })
    : pino();

export default logger;
