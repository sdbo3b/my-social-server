import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  following: string[];
  isAdmin: boolean;
}

interface UserModel extends Model<IUser> {
  createSalt(): Promise<string>;
  createHash(plainPassword: string, salt: string): Promise<string>;
  correctPassword(password: string, userPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.statics.createSalt = async function () {
  return await bcrypt.genSalt(10);
};

UserSchema.statics.createHash = async function (plainPassword, salt) {
  return await bcrypt.hash(plainPassword, salt);
};

UserSchema.statics.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

export default model<IUser, UserModel>("User", UserSchema);
