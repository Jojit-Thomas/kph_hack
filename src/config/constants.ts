import { z } from "zod";

const ENVS = z.object({
  JWT_SECRET: z.string(),
});

const envs = ENVS.parse(process.env);

const SERVER_CONFIG = {
  ...envs,
};

export default SERVER_CONFIG;
