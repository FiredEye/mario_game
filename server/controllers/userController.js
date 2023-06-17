const userModel = require("../models/userModel");

async function createScore(req, res) {
  try {
    const { name, score } = req.body;

    const newScore = await userModel.insertScore(name, score);

    res
      .status(201)
      .json({ message: "Data inserted successfully", data: newScore });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(400).json({ message: "Failed to insert data" });
  }
}

async function updateScore(req, res) {
  try {
    const { score } = req.body;
    const id = req.params.id;

    const updatedScore = await userModel.updateScore(id, score);

    res
      .status(200)
      .json({ message: "Data updated successfully", data: updatedScore });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(404).json({ message: "Failed to update data" });
  }
}

async function getAllScores(req, res) {
  try {
    const scores = await userModel.getAllScores();

    res
      .status(200)
      .json({ data: scores, message: "Data extracted successfully" });
  } catch (error) {
    console.error("Error extracting data:", error);
    res.status(404).json({ message: "Failed to extract data" });
  }
}

async function getHighestScore(req, res) {
  try {
    const highestScore = await userModel.getHighestScore();

    res
      .status(200)
      .json({ highestScore, message: "Data extracted successfully" });
  } catch (error) {
    console.error("Error extracting data:", error);
    res.status(404).json({ message: "Failed to extract data" });
  }
}

module.exports = {
  createScore,
  updateScore,
  getAllScores,
  getHighestScore,
};
