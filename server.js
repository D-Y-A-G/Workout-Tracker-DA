// const { lookup } = require("dns");
const express = require("express");
// const mongojs = require("mongojs");


const logger = require("morgan");

const app = express();
const Workout = require("./models/Workout");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.post("/submit", ({ body }, res) => {
  Workout.create(body).then((dbWorkout) => {
    res.json(dbWorkout);
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
