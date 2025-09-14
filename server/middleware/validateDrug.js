module.exports = (req, res, next) => {
  const { name, dosage, card, pack, perDay } = req.body;

  if (!name || name.length <= 5) {
    return res.status(400).json({ error: "Name length must be more than 5" });
  }

  const dosageRegex = /^\d+-morning,\d+-afternoon,\d+-night$/;
  if (!dosage || !dosageRegex.test(dosage)) {
    return res
      .status(400)
      .json({ error: "Dosage must follow XX-morning,XX-afternoon,XX-night" });
  }

  if (!card || Number(card) <= 1000) {
    return res.status(400).json({ error: "Card must be more than 1000" });
  }

  if (!pack || Number(pack) <= 0) {
    return res.status(400).json({ error: "Pack must be more than 0" });
  }

  if (!perDay || Number(perDay) <= 0 || Number(perDay) >= 90) {
    return res
      .status(400)
      .json({ error: "PerDay must be more than 0 and less than 90" });
  }

  next();
};
