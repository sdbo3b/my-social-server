import express from "express";
import usersRoute from "./users";
import postsRoute from "./posts";

const router = express.Router();

router.use("/users", usersRoute);
router.use("/posts", postsRoute);

export default router;
