const database = require("../db");

const getRestaurant = async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM restaurant_details";
    const [rows] = await database.query(viewQuery);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "database fetching error: " + error,
    });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const { name, description, food_details, address, rating, delivery_charge, delivery_time } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !image_url || !description || !food_details || !address || !rating || !delivery_charge || !delivery_time) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertQuery = `
      INSERT INTO restaurant_details 
      (name, image_url, description, food_details, address,rating,delivery_charge,delivery_time) 
      VALUES (?, ?, ?, ?, ?,?,?,?)`;
    const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";
    const [result] = await database.query(insertQuery, [
      name,
      url + image_url,
      description,
      food_details,
      address,
      rating, delivery_charge, delivery_time
    ]);


    res.status(201).json({
      message: "Restaurant added successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database inserting error: " + error,
    });
  }
};

const putRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.res_id;
    const { name, description, food_details, address, rating, delivery_charge, delivery_time } = req.body;

    const image_url = req.file ? req.file.filename : req.body.image_url;

    if (!name || !description || !food_details
       || !address || !rating || !delivery_charge || !delivery_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updateQuery = `
      UPDATE restaurant_details SET
      name=?, image_url=?, description=?, food_details=?, address=?, rating=?, delivery_charge=?, delivery_time=?
      WHERE res_id = ?
    `;
    const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";
    const [result] = await database.query(updateQuery, [
      name,
      url + image_url,
      description,
      food_details,
      address,
      rating,
      delivery_charge,
      delivery_time,
      restaurantId,
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Restaurant updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database update error: " + error });
  }
};

const patchRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.res_id;
    const updates = req.body;

    if (req.file) updates.image_url = req.file.filename;

    const fields = Object.keys(updates).map(field => `${field}=?`).join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE restaurant_details SET ${fields} WHERE res_id = ?`;

    const [result] = await database.query(updateQuery, [...values, restaurantId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant partially updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database patch error: " + error });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const res_id = req.params.res_id;

    const deleteQuery = "DELETE FROM restaurant_details WHERE res_id = ?";
    const [result] = await database.query(deleteQuery, [res_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Database delete error: " + error,
    });
  }
};

const addRestaurantFood = async (req, res) => {
  try {
    const id = req.params.res_id;

    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const [rows] = await database.query(
      "SELECT food_details FROM restaurant_details WHERE res_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let foodList = [];

    if (rows[0].food_details) {
      try {
        foodList = JSON.parse(rows[0].food_details);
      } catch (e) {
        foodList = []; // fallback
      }
    }

    const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";

    // Create new food item
    const newFood = {
      name,
      price,
      description,
      image: req.file ? url + req.file.filename : null,
    };

    // Add new food to list
    foodList.push(newFood);

    // Save list back to DB
    await database.query(
      "UPDATE restaurant_details SET food_details = ? WHERE res_id = ?",
      [JSON.stringify(foodList), id]
    );

    res.status(201).json({
      message: "Food item added successfully",
      food_details: foodList,
    });

  } catch (error) {
    res.status(500).json({ message: "POST error: " + error });
  }
};

const putRestaurantFood = async (req, res) => {
  try {
    const id = req.params.res_id;

    // Get JSON list from form-data
    let { food_details } = req.body;

    if (!food_details) {
      return res.status(400).json({ message: "food_details is required" });
    }
    // Convert string → JSON
    food_details = JSON.parse(food_details);

    const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (food_details[index]) {
          food_details[index].image = url + file.filename;
        }
      });
    }

    // Update DB
    await database.query(
      `UPDATE restaurant_details SET food_details = ? WHERE res_id = ?`,
      [JSON.stringify(food_details), id]
    );

    res.json({
      message: "food_details list replaced successfully",
      food_details,
    });

  } catch (error) {
    res.status(500).json({ message: "PUT error: " + error });
  }
};

const patchRestaurantFood = async (req, res) => {
  try {
    const id = req.params.res_id;
    const { food_index, name, price, description } = req.body;

    // Find restaurant
    const [rows] = await database.query(
      "SELECT food_details FROM restaurant_details WHERE res_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let foodList = JSON.parse(rows[0].food_details); // Current list

    if (!foodList[food_index]) {
      return res.status(400).json({ message: "Food index not found" });
    }

    // Update fields only if they are provided
    if (name) foodList[food_index].name = name;
    if (price) foodList[food_index].price = price;
    if (description) foodList[food_index].description = description;

    // If user uploads a new food image
    if (req.file) {
      const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";
      foodList[food_index].image = url + req.file.filename;
    }

    // Save updated JSON back into DB
    await database.query(
      "UPDATE restaurant_details SET food_details = ? WHERE res_id = ?",
      [JSON.stringify(foodList), id]
    );

    res.json({
      message: "Food item updated successfully",
      food_details: foodList
    });

  } catch (error) {
    res.status(500).json({ message: "PATCH error: " + error });
  }
}
module.exports = { getRestaurant, addRestaurant, putRestaurant, patchRestaurant, addRestaurantFood, putRestaurantFood, patchRestaurantFood, deleteRestaurant };