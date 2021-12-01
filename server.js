const express = require("express");
const logger = require("morgan");
const path = require("path");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const app = express();
const Workout = require("./models/Workout");

// const { Workout } = require("./models");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

//////////////////////// New  Workout route //////////////////////

app.get("/exercise", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/exercise.html"))
);

app.post("/api/workouts", (req, res) => {
  Workout.create(req.body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
////////////////////// stats route ///////////////////////////////

app.get("/stats", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/stats.html"))
);

// app.get("/submit", ({ body }, res) => {
//   workout.create(body).then((dbWorkout) => {
//     res.json(dbWorkout);
//   });
// });

//////////// getting last workout data /////////////////

app.get("/api/workouts", async (req, res) => {
  Workout.aggregate([
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
      res.json(err);
    });
});

////////////////////// continue workout route//////////////////////////

app.put("api/workouts/:id", (req, res) => {
  Workout.findByIdAndUpdate({ _id: req.params.id }, { $push: req.body })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
