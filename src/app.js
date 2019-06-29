const express = require("express");
const app = express();
const NameHelper = require("./name-helper");
const Joi = require("@hapi/joi");

app.use(express.json());

//Q1: which is better? Required() and test {} ot test{ name : ""}
const nameSchema = Joi.object().keys({
  name: Joi.string().min(3),
  oldName: Joi.string().min(3),
  newName: Joi.string().min(3)
});

const validateName = (req, res, next) => {
  const { name, oldName, newName } = req.body;
  const result = Joi.validate({ name, oldName, newName }, nameSchema);

  if (result.error) {
    res
      .status(400)
      .json({ message: "name are not valid input and is required" });
  } else {
    next();
  }
};

//Q2: is it better to separate?
// const otherNameSchema = Joi.object().keys({
//   oldName: Joi.string()
//     .min(3)
//     .required(),
//   newName: Joi.string()
//     .min(3)
//     .required()
// });

// const validateOldNameNewName = (req, res, next) => {
//   const { oldName, newName } = req.body;
//   const result = Joi.validate({ oldName, newName }, otherNameSchema);

//   if (result.error) {
//     res
//       .status(400)
//       .json({ message: "name are not valid input and is required" });
//   } else if (
//     !NameHelper.names.includes(oldName) ||
//     NameHelper.names.includes(newName)
//   ) {
//     return res.sendStatus(422);
//   } else {
//     next();
//   }
// };

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

  //Q3: if I pass randomNames below, it does not work...
  // if (!randomNames.length) {
  //   randomNames = NameHelper.getRandomName(NameHelper.names);
  // }

  while (NameHelper.names.length) {
    pairsArray.push(NameHelper.names.splice(0, 2));
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

app.put("/names", validateName, (req, res) => {
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
