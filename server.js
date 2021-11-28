const { lookup } = require("dns");
const express = require("express");
// const mongojs = require("mongojs");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const logger = require("morgan");

const app = express();
const workout = require("./models/Workout");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

//////////////////////// New  Workout route //////////////////////

app.post("/api/workouts/:id", ({ body }, res) => {
  workout.create(body).then((dbWorkout) => {
    res.json(dbWorkout);
  });
});

////////////getting the stats from dashboard route /////////////////

app.get("/api/workouts", async (req, res) => {
  workout
    .aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$exercises.duration" },
        },
      },
    ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
