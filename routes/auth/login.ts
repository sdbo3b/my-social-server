import express from "express";
import UserModel from "../../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json("user not found");

    const validPassword = UserModel.correctPassword(password, user.password);
    if (!validPassword) return res.status(400).json("wrong password");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("Server Error");
  }
});

export default router;
