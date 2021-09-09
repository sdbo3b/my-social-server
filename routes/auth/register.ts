import express from "express";
import UserModel from "../../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    username,
    email,
    password,
    profilePicture,
    coverPicture,
    from,
    city,
    desc,
    relationship,
  } = req.body;

  try {
    const newUser = new UserModel({
      username,
      email,
      password: UserModel.createHash(password, UserModel.createSalt()),
      profilePicture,
      coverPicture,
      from,
      city,
      desc,
      relationship,
    });

    // Save user in DB and return response
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server Error");
  }
});

export default router;
