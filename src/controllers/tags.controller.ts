import { Router } from "express";
import { HttpError } from "../types";
import { validateNumberStrings } from "../validations";

const tags = [
  {
    id: 1,
    title: "dev",
  },
];

const router = Router();

router.get("/", (req, res) => {
  res.json(tags);
});

router.get("/:id", validateNumberStrings(["id"]), (req, res) => {
  const { id } = req.params;
  const tag = tags.find((tag) => tag.id == Number(id));

  if (!tag) throw new HttpError(404, "Tag not found!");
  //   res.json(tag);
  return tag;
});

export const tagsController = {
  path: "/tags",
  router,
};
