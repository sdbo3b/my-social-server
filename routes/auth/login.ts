import express from "express";
import UserModel from "../../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) res.status(404).json("user not found");

    const validPassword = await UserModel.correctPassword(
      password,
      user.password
    );
    if (!validPassword) res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

export default router;
