const express = require("express");
const Issue = require("../models/issue");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ISSUE (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, labels, assignedTo } = req.body;

    const newIssue = new Issue({
      title,
      description: description || "",
      priority: priority || "medium",
      labels: Array.isArray(labels) ? labels : [],
      assignedTo: assignedTo || null,
      createdBy: req.userId
    });

    await newIssue.save();
    return res.status(201).json(newIssue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// LIST ISSUES (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, priority, label, sort } = req.query;

    // filtro base: solo issue dell’utente loggato
    const filter = { createdBy: req.userId };

    // filtri opzionali
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // label singola: /api/issues?label=bug
    if (label) filter.labels = label;

    // sorting
    // sort=newest | oldest
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const issues = await Issue.find(filter)
        .populate("comments.author","username email")
        .sort(sortOption);  
    
    return res.json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// UPDATE ISSUE (protected)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Permettiamo update solo di questi campi
    const allowedUpdates = ["title", "description", "status", "priority", "labels", "assignedTo"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Importante: l'issue deve appartenere all'utente (createdBy)
    const issue = await Issue.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// x add label
router.patch("/:id/labels/add", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({ message: "Label is required" });
    }

    const issue = await Issue.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      { $addToSet: { labels: label.trim() } }, // addToSet evita duplicati
      { new: true }
    );

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// x remove label
router.patch("/:id/labels/remove", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({ message: "Label is required" });
    }

    const issue = await Issue.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      { $pull: { labels: label.trim() } },
      { new: true }
    );

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json(err);
  }
});



// GET SINGLE ISSUE (protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findOne({ 
      _id: req.params.id, 
      createdBy: req.userId 
    })
    .populate("comments.author", "username email");

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    return res.json(issue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ADD COMMENT (protected)
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findOne({ _id: id, createdBy: req.userId });
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.comments.push({
      text: text.trim(),
      author: req.userId
    });

    await issue.save();
    return res.status(201).json(issue);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// DELETE COMMENT (protected)
router.delete("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const issue = await Issue.findOne({ _id: id, createdBy: req.userId });
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comment = issue.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // (Extra safety) allow deletion only if author matches OR issue owner
    const isAuthor = String(comment.author) === String(req.userId);
    const isOwner = String(issue.createdBy) === String(req.userId);

    if (!isAuthor && !isOwner) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    comment.deleteOne(); // remove subdocument
    await issue.save();

    return res.json({ message: "Comment deleted", issue });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// DELETE ISSUE (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!deleted) return res.status(404).json({ message: "Issue not found" });

    return res.json({ message: "Issue deleted" });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// UPDATE ISSUE (protected) - status / priority / labels / description / title
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Issue.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { $set: req.body },
      { new: true }
    ).populate("comments.author", "username email");

    if (!updated) return res.status(404).json({ message: "Issue not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json(err);
  }
});



module.exports = router;
