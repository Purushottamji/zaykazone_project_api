
const database = require("../db");

const getPaymentByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const viewQuery = "SELECT * FROM payment WHERE user_id = ?";
    const [rows] = await database.query(viewQuery, [user_id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const addPaymentDetails = async (req, res) => {
  try {
    const { user_id, card_holder_name, card_number, exp_date, cvv } = req.body;

    const insertQuery =
      "INSERT INTO payment (user_id, card_holder_name, card_number, exp_date, cvv) VALUES (?, ?, ?, ?, ?)";

    const values = [user_id, card_holder_name, card_number, exp_date, cvv];

    await database.query(insertQuery, values);

    res.status(201).json({
      user_id,
      card_holder_name,
      card_number,
      exp_date,
      cvv,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const deletePaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM payment WHERE id = ?";
    const [result] = await database.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.status(200).json({ message: "Payment record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = {
  getPaymentByUserId,
  addPaymentDetails,
  deletePaymentDetails,
};
