const planningService = require("./planning.services");

exports.createPlanning = async (req, res) => {
  try {
    const planning = await planningService.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(planning);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getPlannings = async (req, res) => {
  const data = await planningService.getAll(req.user.id);
  res.json(data);
};

exports.getPlanning = async (req, res) => {
  const data = await planningService.getOne(req.params.id);
  res.json(data);
};

exports.updatePlanning = async (req, res) => {
  const data = await planningService.update(req.params.id, req.body);
  res.json(data);
};

exports.deletePlanning = async (req, res) => {
  await planningService.remove(req.params.id);
  res.json({ message: "deleted" });
};