const express = require("express");
const app = express();
const NameHelper = require("./name-helper");
const { validateName, validateOldNameNewName } = require("./name-validation");

app.use(express.json());

let randomNames = [];
app.get("/name", (req, res) => {
  if (!randomNames.length) {
    randomNames = NameHelper.getRandomName(NameHelper.names);
  }
  res
    .status(200)
    .send(
      `${NameHelper.names.length -
        randomNames.length +
        1}. ${randomNames.shift()}`
    );
});

app.get("/pairs", (req, res) => {
  const pairsArray = [];
  const randomNamesList = NameHelper.getRandomName(NameHelper.names);

  while (randomNamesList.length) {
    pairsArray.push(randomNamesList.splice(0, 2));
  }

  const pairs = pairsArray.map(pair => {
    return { first: pair[0], second: pair[1] };
  });

  res.status(200).json(pairs);
});

app.get("/names", (req, res) => {
  res.json(NameHelper.names);
});

app.post("/names", validateName, (req, res) => {
  const { name } = req.body;

  if (NameHelper.names.includes(name)) {
    return res.sendStatus(422);
  } else {
    NameHelper.names.push(name);
    return res.json(NameHelper.names);
  }
});

app.delete("/names", validateName, (req, res) => {
  const { name } = req.body;

  if (!NameHelper.names.includes(name)) {
    return res.sendStatus(422);
  } else {
    NameHelper.names = NameHelper.names.filter(element => element !== name);
    return res.json(NameHelper.names);
  }
});

app.put("/names", validateOldNameNewName, (req, res) => {
  const { oldName, newName } = req.body;

  if (
    !NameHelper.names.includes(oldName) ||
    NameHelper.names.includes(newName)
  ) {
    return res.sendStatus(422);
  } else {
    NameHelper.names = NameHelper.names.filter(element => element !== oldName);
    NameHelper.names.push(newName);
    return res.json(NameHelper.names);
  }
});

module.exports = app;
