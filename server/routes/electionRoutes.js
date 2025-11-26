const express = require("express");
const Election = require("../models/Election");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/elections
// Create new election (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, options, startsAt, endsAt } = req.body;

    const election = await Election.create({
      title,
      description,
      options: options.map((text) => ({ text })),
      startsAt,
      endsAt,
      createdBy: req.user.id
    });

    res.status(201).json(election);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/elections
// Get all elections (public)
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/elections/:id
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
