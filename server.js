const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addRoutes");
const otpRoutes = require("./routes/otpRoutes");
const phoneOtpRoutes = require("./routes/phoneOtp");
const { upload } = require("./middleware/upload");

const database = require("./db");
const db = require("./db");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/phone", phoneOtpRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/address", addressRoutes);
app.use("/otp", otpRoutes);



app.get("/restaurant", async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM restaurant_details";
    const [rows] = await database.query(viewQuery);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "database fetching error: " + error,
    });
  }
});

app.post("/restaurant", upload.single("image_url"), async (req, res) => {
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
});


app.put("/restaurant/:res_id", upload.single("image_url"), async (req, res) => {
  try {
    const restaurantId = req.params.res_id;
    const { name, description, food_details, address, rating, delivery_charge, delivery_time } = req.body;

    const image_url = req.file ? req.file.filename : req.body.image_url;

    if (!name || !description || !food_details || !address || !rating || !delivery_charge || !delivery_time) {
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
});

app.patch("/restaurant/:res_id", upload.single("image_url"), async (req, res) => {
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
});

app.delete("/restaurant/:res_id", async (req, res) => {
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
});



app.get("/food", async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM food_details";
    const [rows] = await database.query(viewQuery);

    res.status(200).json({ message: rows });
  } catch (error) {
    res.status(500).json({
      message: "database fetching error: " + error,
    });
  }
});


app.post("/food", upload.single("image"), async (req, res) => {
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
        const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";
    const [result] = await database.query(insertQuery, [
      name, restaurant_name, url+image, rating, delivery_type, time, description,
      sizes, ingredients, price, quantity, restaurant_id
    ]);

    res.status(201).json({ message: "Food added successfully", insertId: result.insertId });

  } catch (error) {
    res.status(500).json({ message: "Database insert error: " + error });
  }
});

app.put("/food/:id", upload.single("image"), async (req, res) => {
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
        const url = "https://zaykazone-project-api.onrender.com/uploads/user_pic/";
    const [result] = await database.query(updateQuery, [
      name, restaurant_name, url+image, rating, delivery_type, time, description,
      sizes, ingredients, price, quantity, restaurant_id, id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Food not found" });

    res.status(200).json({ message: "Food updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database update error: " + error });
  }
});

app.patch("/food/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (req.file) updates.image = req.file.filename;

    const fields = Object.keys(updates).map(f => `${f}=?`).join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE food_details SET ${fields} WHERE id = ?`;

    const [result] = await database.query(updateQuery, [...values, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food partially updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database patch error: " + error });
  }
});


app.delete("/food/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteQuery = "DELETE FROM food_details WHERE id = ?";
    const [result] = await database.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Database delete error: " + error,
    });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.error("server error :" + err.message);
  console.log(`server running on port ${PORT}`);


})

