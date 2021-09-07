import express from "express";
import PostModel from "../../models/post";
import UserModel from "../../models/user";

const router = express.Router();

// create a post
router.post("/", async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Unauthorized user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("Unauthorized user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Disliked post");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.params.userId);
    const userPosts = await PostModel.find({ userId: currentUser._id });
    const friendPosts = await Promise.all<any>(
      currentUser.following.map((friendId) => {
        return PostModel.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
