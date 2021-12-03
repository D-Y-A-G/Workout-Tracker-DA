const router = require("express").Router();
const path = require("path");
const db = require("../models");
const mongoose = require("mongoose");

////////////////////// Routes ///////////////////////////

router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

/////////////////// exercise and stats route //////////////////////////
router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

router.get("/exercise", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/exercise.html"))
);

router.get("api/workouts/range", (req, res) => {
  db.Workout.find({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//////////// getting last workout data /////////////////

router.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: "$exercises.duration" },
      },
    },
  ])
    .sort({ day: 1 })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//////////////// routes to store new exercise data //////////////////////////

router.post("/api/workouts/", ({ body }, res) => {
  db.Workout.create(body)

    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

////////////////////// complete workout route //////////////////////////

router.put("/api/workouts/:id", (req, res) => {
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
