const userModel = require("../models/userModel");

async function createScore(req, res) {
  try {
    const { name, score, code, created_at, updated_at } = req.body;

    const newScore = await userModel.insertScore(
      name,
      score,
      code,
      created_at,
      updated_at
    );

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
    const { score, updated_at } = req.body;
    const id = req.params.id;

    const updatedScore = await userModel.updateScore(id, score, updated_at);

    res
      .status(200)
      .json({ message: "Data updated successfully", data: updatedScore });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(404).json({ message: "Failed to update data" });
  }
}

async function updateLastPlayed(req, res) {
  try {
    const { updated_at } = req.body;
    const id = req.params.id;

    await userModel.updateLastPlayed(id, updated_at);

    res.status(200).json({ message: "Last played updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(404).json({ message: "Failed to update data" });
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

async function paginatedScores(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, defaulting to 1
    const limit = parseInt(req.query.limit) || 10; // Number of records per page, defaulting to 10

    const paginatedRecords = await userModel.Record.getPaginatedRecords(
      page,
      limit
    );
    const totalCount = await userModel.Record.getTotalCount();

    res.status(200).json({
      data: paginatedRecords,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      message: "Data extracted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: "Failed to extract data" });
  }
}

module.exports = {
  paginatedScores,
  createScore,
  updateScore,
  updateLastPlayed,
  getHighestScore,
};
