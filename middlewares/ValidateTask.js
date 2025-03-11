const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("Pending", "Completed").required(),
  dueDate: Joi.date().optional(),
});

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = validateTask;
