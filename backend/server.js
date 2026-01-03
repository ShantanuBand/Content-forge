import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.error("MongoDB connection error:", err.message)
  );

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
