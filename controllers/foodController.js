const db=require("../db");

const getFood=async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM food_details";
    const [rows] = await db.query(viewQuery);
    res.status(200).json({ message: rows });
  } catch (error) {
    res.status(500).json({
      message: "database fetching error: " + error,
    });
  }
};


const postFoodDetails=async (req, res) => {
  try {
    const {
      name,
      restaurant_name,
      rating,
      delivery_type,
      time,
      description,
      sizes,
      ingredients,
      price,
      quantity,
      restaurant_id,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !restaurant_name || !rating || !delivery_type || !time || !description || !sizes ||
      !ingredients || !price || !quantity || !restaurant_id || !image) {
      return res.status(400).json({ message: "All fields are required including image" });
    }

    const insertQuery = `
      INSERT INTO food_details
      (name, restaurant_name, image, rating, delivery_type, time, description, sizes, ingredients, price, quantity, restaurant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [
      name, restaurant_name, image, rating, delivery_type, time, description,
      sizes, ingredients, price, quantity, restaurant_id
    ]);

    res.status(201).json({ message: "Food added successfully", insertId: result.insertId });

  } catch (error) {
    res.status(500).json({ message: "Database insert error: " + error });
  }
}

const putFoodDetails=async (req, res) => {
  try {
    const id = req.params.id;

    const {
      name,
      restaurant_name,
      rating,
      delivery_type,
      time,
      description,
      sizes,
      ingredients,
      price,
      quantity,
      restaurant_id
    } = req.body;

    const image = req.file ? req.file.filename : req.body.image;

    const updateQuery = `
      UPDATE food_details SET 
      name=?, restaurant_name=?, image=?, rating=?, delivery_type=?, time=?, description=?, sizes=?, 
      ingredients=?, price=?, quantity=?, restaurant_id=? 
      WHERE id = ?
    `;
    const [result] = await db.query(updateQuery, [
      name, restaurant_name, image, rating, delivery_type, time, description,
      sizes, ingredients, price, quantity, restaurant_id, id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Food not found" });

    res.status(200).json({ message: "Food updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database update error: " + error });
  }
}

const patchFoodDetails=async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (req.file) updates.image = req.file.filename;

    const fields = Object.keys(updates).map(f => `${f}=?`).join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE food_details SET ${fields} WHERE id = ?`;

    const [result] = await db.query(updateQuery, [...values, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food partially updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database patch error: " + error });
  }
};

const deleteFoodDetails= async (req, res) => {
  try {
    const id = req.params.id;

    const deleteQuery = "DELETE FROM food_details WHERE id = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Database delete error: " + error,
    });
  }
};

module.exports={getFood,postFoodDetails,putFoodDetails,patchFoodDetails,deleteFoodDetails};