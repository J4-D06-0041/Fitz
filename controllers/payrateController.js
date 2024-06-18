const Payrate = require("../models/Payrate");

exports.addPayrate = async (req, res) => {
  const { userId, hourlyRate } = req.body;

  try {
    const payrate = new Payrate({
      user: userId,
      hourlyRate,
    });

    await payrate.save();
    res.json(payrate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPayrateByUserId = async (req, res) => {
  try {
    const payrate = await Payrate.findOne({ user: req.params.userId });
    if (!payrate) {
      return res.status(404).json({ msg: "Pay rate not found" });
    }
    res.json(payrate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updatePayrate = async (req, res) => {
  const { hourlyRate } = req.body;

  try {
    let payrate = await Payrate.findOne({ user: req.params.userId });
    if (!payrate) {
      return res.status(404).json({ msg: "Pay rate not found" });
    }

    payrate = await Payrate.findOneAndUpdate({ user: req.params.userId }, { $set: { hourlyRate } }, { new: true });

    res.json(payrate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
