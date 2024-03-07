const Admin = require("../models/Yayin");
var express = require("express");
var router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {id} = req.body;
    const newYayin = await Yayin.create({
      id
    });
    res.status(201).json({ message: "Yayin Created!!", Yayin: newYayin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;