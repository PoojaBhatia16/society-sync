// seed/seedSocieties.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import {Society} from "../models/society.models.js";
import {DB_NAME} from "../constants.js";

dotenv.config({ path: ".env" });
await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
);



const societies = [
  {
    name: "SAE Collegiate Club",
    description:
      "Society of Automotive Engineers — pushing engineering forward.",
    logo: "",
    email: "sae@manit.ac.in",
  },
  {
    name: "ISTE",
    description:
      "Indian Society for Technical Education — enhancing quality & standards.",
    logo: "",
    email: "iste@manit.ac.in",
  },
  {
    name: "IEEE",
    description: "Advancing technology for humanity.",
    logo: "",
    email: "ieee@manit.ac.in",
  },
  {
    name: "N.S.S.",
    description: "National Service Scheme — not me but you.",
    logo: "",
    email: "nss@manit.ac.in",
  },
  {
    name: "Web Development and Internet Radio Club (WDIRC)",
    description: "Building web and broadcasting voices.",
    logo: "",
    email: "wdirc@manit.ac.in",
  },
  {
    name: "Tooryanaad Samiti",
    description: "Voice of MANIT — public speaking and cultural expression.",
    logo: "",
    email: "tooryanaad@manit.ac.in",
  },
  {
    name: "IBC Cell",
    description: "Industry and Business Collaboration cell.",
    logo: "",
    email: "ibc@manit.ac.in",
  },
  {
    name: "Debating Cell",
    description: "Where arguments meet intellect.",
    logo: "",
    email: "debating@manit.ac.in",
  },
  {
    name: "Drishtant Cell",
    description: "Dramatics and stage performance.",
    logo: "",
    email: "drishtant@manit.ac.in",
  },
  {
    name: "Magazine Editorial Cell",
    description: "Curating creativity in print.",
    logo: "",
    email: "editorial@manit.ac.in",
  },
  {
    name: "Quizzers Cell",
    description: "Challenging minds with questions.",
    logo: "",
    email: "quizzers@manit.ac.in",
  },
  {
    name: "Robotics",
    description: "Innovating with AI, bots, and automation.",
    logo: "",
    email: "robotics@manit.ac.in",
  },
  {
    name: "Vision",
    description: "Photography and design club.",
    logo: "",
    email: "vision@manit.ac.in",
  },
  {
    name: "Pixel",
    description: "Creative media and animations.",
    logo: "",
    email: "pixel@manit.ac.in",
  },
  {
    name: "Aero-astro@MANIT",
    description: "Aeronautics and space exploration club.",
    logo: "",
    email: "aeroastro@manit.ac.in",
  },
  {
    name: "Think India",
    description: "Nationalism, innovation, and youth leadership.",
    logo: "",
    email: "thinkindia@manit.ac.in",
  },
  {
    name: "Entrepreneur Development Cell",
    description: "Fostering startups and business ideas.",
    logo: "",
    email: "edc@manit.ac.in",
  },
  {
    name: "Technosearch",
    description: "Annual tech fest of MANIT.",
    logo: "",
    email: "technosearch@manit.ac.in",
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
