/**
 * Learn Feature Routes Aggregator
 * Central point for all learn-by-topic related routes
 */

const express = require("express");
const router = express.Router();

const learnRoutes = require("./routes/learn.routes");

router.use("/", learnRoutes);

module.exports = router;
