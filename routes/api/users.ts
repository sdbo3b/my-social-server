import express from "express";
import UserModel from "../../models/user";

const router = express.Router();

// update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = UserModel.createHash(
          req.body.password,
          UserModel.createSalt()
        );
      } catch (err) {
        return res.send(500).json("Server Error");
      }
    }

    try {
      const user = await UserModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account updated");
    } catch (err) {
      return res.status(500).json("Server Error");
    }
  } else {
    return res.status(403).json("Unauthorized user");
  }
});

// delete

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account deleted");
    } catch (err) {
      return res.status(500).json("Server Error");
    }
  } else {
    return res.status(403).json("Unauthorized user");
  }
});

// get

router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const { password, updatedAt, ...props } = user.toObject();
    res.status(200).json(props);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// follow user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const targetUser = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.body.userId);

      if (!targetUser.followers.includes(req.body.userId)) {
        await targetUser.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("Followed user");
      } else res.status(403).json("Already following user");
    } catch (err) {
      res.status(500).json("Server Error");
    }
  } else {
    res.status(403).json("Invalid request: cannot follow yourself");
  }
});

// unfollow user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const targetUser = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.body.userId);

      if (targetUser.followers.includes(req.body.userId)) {
        await targetUser.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User unfollowed");
      } else res.status(403).json("You don't follow this user");
    } catch (err) {
      res.status(500).json("Server Error");
    }
  } else {
    res.status(403).json("Invalid request: cannot unfollow yourself");
  }
});

export default router;
