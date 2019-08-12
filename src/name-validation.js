const Joi = require("@hapi/joi");

const nameSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .required()
});

const validateName = (req, res, next) => {
  const { name } = req.body;
  const result = Joi.validate({ name }, nameSchema);

  if (result.error) {
    res
      .status(400)
      .json({ message: "name are not valid input and/or is required" });
  } else {
    next();
  }
};

const oldNameNewNameSchema = Joi.object().keys({
  oldName: Joi.string()
    .min(3)
    .required(),
  newName: Joi.string()
    .min(3)
    .required()
});

const validateOldNameNewName = (req, res, next) => {
  const { oldName, newName } = req.body;
  const result = Joi.validate({ oldName, newName }, oldNameNewNameSchema);

  if (result.error) {
    res
      .status(400)
      .json({ message: "name are not valid input and/or is required" });
  } else {
    next();
  }
};

module.exports = {
  validateName,
  validateOldNameNewName
};
