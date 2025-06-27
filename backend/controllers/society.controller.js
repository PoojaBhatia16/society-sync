import {Society} from "../models/society.models.js";

const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllSocieties };