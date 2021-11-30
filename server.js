const express = require("express");
const logger = require("morgan");
const path = require("path");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

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

app.get("/submit", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/exercise.html"))
);

////////////////////// stats route ///////////////////////////////

// app.get("/submit", ({ body }, res) => {
//   workout.create(body).then((dbWorkout) => {
//     res.json(dbWorkout);
//   });
// });

//////////// getting last workout data /////////////////

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

////////////////////// adding a new workout //////////////////////////

////////////////////// dashboard route ///////////////////////////////

/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
