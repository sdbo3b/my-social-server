import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  following: string[];
  isAdmin: boolean;
  desc: string;
  city: string;
  from: string;
  relationship: number;
  createdAt: string;
  updatedAt: string;
}

interface UserModel extends Model<IUser> {
  createSalt(): string;
  createHash(plainPassword: string, salt: string): string;
  correctPassword(password: string, userPassword: string): boolean;
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
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

UserSchema.statics.createSalt = function () {
  return bcrypt.genSaltSync(10);
};

UserSchema.statics.createHash = function (plainPassword, salt) {
  return bcrypt.hashSync(plainPassword, salt);
};

UserSchema.statics.correctPassword = function (password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
};

export default model<IUser, UserModel>("User", UserSchema);
