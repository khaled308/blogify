import express from "express";
import { PORT } from "./config/constants";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
