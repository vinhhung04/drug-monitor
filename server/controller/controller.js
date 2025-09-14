const Drugdb = require('../model/model');

// --------------------- CREATE ---------------------
exports.create = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: "Content cannot be empty!" });
        }

        const drug = new Drugdb({
            name: req.body.name,
            card: req.body.card,
            pack: req.body.pack,
            perDay: req.body.perDay,
            dosage: req.body.dosage
        });

        const data = await drug.save();
        console.log(`${data.name} added to the database`);
        res.redirect('/manage'); // redirect về trang quản lý
    } catch (err) {
        res.status(500).send({ message: err.message || "Error while adding the drug" });
    }
};

// --------------------- FIND ---------------------
exports.find = async (req, res) => {
    try {
        if (req.query.id) {
            // tìm theo ID
            const data = await Drugdb.findById(req.query.id);
            if (!data) return res.status(404).send({ message: `Can't find drug with id: ${req.query.id}` });
            res.send(data);
        } else {
            // tìm tất cả
            const drugs = await Drugdb.find();
            res.send(drugs);
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving drug information" });
    }
};

// --------------------- UPDATE ---------------------
exports.update = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: "Cannot update an empty drug" });
        }

        const id = req.params.id;
        const updatedDrug = await Drugdb.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDrug) return res.status(404).send({ message: `Drug with id: ${id} cannot be updated` });

        res.status(200).send(updatedDrug);
    } catch (err) {
        res.status(500).send({ message: "Error in updating drug information", error: err.message });
    }
};

// --------------------- DELETE ---------------------
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Drugdb.findByIdAndDelete(id);
        if (!data) return res.status(404).send({ message: `Cannot delete drug with id: ${id}` });

        res.status(200).send({ message: `${data.name} was deleted successfully!` });
    } catch (err) {
        res.status(500).send({ message: `Could not delete drug with id=${req.params.id}`, error: err.message });
    }
};

// --------------------- PURCHASE ---------------------
exports.purchase = async (req, res) => {
  try {
    const { drugId, quantity } = req.body;
    if (!drugId || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "drugId và quantity là bắt buộc, quantity > 0" });
    }

    const drug = await Drugdb.findById(drugId);
    if (!drug) return res.status(404).json({ error: "Không tìm thấy thuốc" });

    if (drug.pack < quantity) {
      return res.status(400).json({ error: "Không đủ số lượng thuốc trong kho" });
    }

    drug.pack -= quantity;
    await drug.save();

    res.status(200).json({
      message: `Mua thành công ${quantity} ${drug.name}`,
      remain: drug.pack,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Lỗi khi mua thuốc" });
  }
};
