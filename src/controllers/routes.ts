import { Express, Router } from "express";
import { tagsController } from "./tags.controller";
import { usersRouter } from "./users.controller";

export const routes = [usersRouter, tagsController];

export function useRoutes(app: Express) {
  routes.forEach(({ path, router }) => app.use(path, router));
}
