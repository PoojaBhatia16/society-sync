// seed/seedSocieties.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Society from "../models/society.models.js";

dotenv.config({ path: ".env" });
await mongoose.connect(process.env.MONGODB_URI);

const societies = [
  {
    name: "Literary Club",
    description: "Where words come to life.",
    logo: "https://example.com/litclub.png",
  },
  {
    name: "Dance Society",
    description: "For those who speak through movement.",
    logo: "https://example.com/danceclub.png",
  },
  {
    name: "Tech Society",
    description: "Geeks, gadgets, and growth.",
    logo: "https://example.com/techsoc.png",
  },
];

const seedSocieties = async () => {
  try {
    await Society.deleteMany();
    await Society.insertMany(societies);
    console.log("Societies seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
};

seedSocieties();
