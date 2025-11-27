const express = require ("express");
const dotenv = require("dotenv");
const database = require("./db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addRoutes");
const multer = require("multer");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/address", addressRoutes);





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





app.post("/restaurant", upload.single("image"), async (req, res) => {
  try {
    const { name, description, food_details, address,rating,delivery_charge,delivery_time } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !image_url || !description || !food_details || !address || !rating || !delivery_charge || !delivery_time) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const insertQuery =`
      INSERT INTO restaurant_details 
      (name, image_url, description, food_details, address,rating,delivery_charge,delivery_time) 
      VALUES (?, ?, ?, ?, ?,?,?,?)`;  

    const [result] = await database.query(insertQuery, [
      name,
      image_url,
      description,
      food_details,
      address,
      rating,delivery_charge,delivery_time
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


app.put("/restaurant/:res_id", upload.single("image"), async (req, res) => {
  try {
    const restaurantId = req.params.res_id;
    const { name, description, food_details, address } = req.body;
    const image_url = req.file ? req.file.filename : req.body.image_url;

    if (!name || !description || !food_details || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updateQuery = `
      UPDATE restaurant_details 
      SET name=?, image_url=?, description=?, food_details=?, address=? 
      WHERE res_id = ?
    `;

    const [result] = await database.query(updateQuery, [
      name,
      image_url,
      description,
      food_details,
      address,
      restaurantId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Database update error: " + error,
    });
  }
});

app.delete("/restaurant/:res_id", async (req, res) => {
  try {
    const restaurantId = req.params.res_id;

    const deleteQuery = "DELETE FROM restaurant_details WHERE res_id = ?";
    const [result] = await database.query(deleteQuery, [restaurantId]);

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
      details,
      prize,
      rate,
      size,
      quantity,
      ingridents,
      delivery_charge,
      delivery_time,
      user_id,
      restaurant_id,
    } = req.body;

    const image_url = req.file ? req.file.filename : null;

    if (
      !name ||
      !image_url ||
      !details ||
      !prize ||
      !rate ||
      !size ||
      !quantity ||
      !ingridents ||
      !delivery_charge ||
      !delivery_time ||
      !user_id ||
      !restaurant_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertQuery = `
      INSERT INTO food_details 
      (name, image_url, details, prize, rate, size, quantity, ingridents, delivery_charge,
      delivery_time, user_id, restaurant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await database.query(insertQuery, [
      name,
      image_url,
      details,
      prize,
      rate,
      size,
      quantity,
      ingridents,
      delivery_charge,
      delivery_time,
      user_id,
      restaurant_id,
    ]);

    res.status(201).json({
      message: "Food details added successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database inserting error: " + error,
    });
  }
});

app.put("/food/:food_id", upload.single("image"), async (req, res) => {
  try {
    const foodId = req.params.food_id;
    const {
      name,
      details,
      prize,
      rate,
      size,
      quantity,
      ingridents,
      delivery_charge,
      delivery_time,
      user_id,
      restaurant_id,
    } = req.body;

    const image_url = req.file ? req.file.filename : req.body.image_url;

    const updateQuery = `
      UPDATE food_details SET 
      name=?, image_url=?, details=?, prize=?, rate=?, size=?, quantity=?, ingridents=?, 
      delivery_charge=?, delivery_time=?, user_id=?, restaurant_id=?
      WHERE food_id = ?
    `;

    const [result] = await database.query(updateQuery, [
      name,
      image_url,
      details,
      prize,
      rate,
      size,
      quantity,
      ingridents,
      delivery_charge,
      delivery_time,
      user_id,
      restaurant_id,
      foodId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food details updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Database update error: " + error,
    });
  }
});

app.delete("/food/:food_id", async (req, res) => {
  try {
    const foodId = req.params.food_id;

    const deleteQuery = "DELETE FROM food_details WHERE food_id = ?";
    const [result] = await database.query(deleteQuery, [foodId]);

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





const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);


})

