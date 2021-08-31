import express from "express";
import registerRoute from "./register";
import loginRoute from "./login";

const router = express.Router();

router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;
