import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config/constants";
import { authRoutes, postRoutes, profileRoutes } from "./routes";
import errorHandler from "./utils/errorHandler";
import notFoundHandler from "./utils/notFoundHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

// routes
app.use("/api/", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/post", postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
