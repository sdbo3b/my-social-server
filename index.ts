import express from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";

const app = express();

dotenv.config();

const port = process.env.PORT || 8800;

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

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
