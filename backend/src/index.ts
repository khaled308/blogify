import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/constants";
import { authRoutes, profileRoutes } from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
