import express from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import multer from "multer";
import path from "path";

const app = express();

dotenv.config();

const port = process.env.PORT || 8800;

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(`/images`, express.static(path.join(__dirname, "../public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully.");
  } catch (err) {
    console.error(err);
  }
});

// routes
app.use("/auth", authRoutes);
app.use("/api/v1", apiRoutes);

connect(process.env.DATABASE_URI)
  .then((db) => {
    console.log(`Connected to DB version ${db.version}`);

    app.listen(port, () => {
      console.log(`server is listening on port:${port}`);
    });
  })
  .catch((err: Error) => console.error(err.message));
