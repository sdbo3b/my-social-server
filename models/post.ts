import { Schema, model } from "mongoose";

interface IPost {
  _id: string;
  userId: string;
  desc: string;
  img: string;
  likes: string[];
}

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

export default model<IPost>("Post", PostSchema);
