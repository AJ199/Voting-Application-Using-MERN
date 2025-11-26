const express = require("express");
const Election = require("../models/Election");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/votes/:electionId
// body: { optionId }
router.post("/:electionId", protect, async (req, res) => {
  try {
    const { optionId } = req.body;
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: "Election not found" });

    const now = new Date();
    if (now < election.startsAt || now > election.endsAt) {
      return res.status(400).json({ message: "Election is not active" });
    }

    // Check if user already voted
    if (election.voters.includes(req.user.id)) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const option = election.options.id(optionId);
    if (!option) return res.status(404).json({ message: "Option not found" });

    option.votesCount += 1;
    election.voters.push(req.user.id);

    await election.save();

    res.json({ message: "Vote submitted successfully", election });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
