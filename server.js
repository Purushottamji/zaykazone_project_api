const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addRoutes");
const otpRoutes = require("./routes/otpRoutes");
const phoneOtpRoutes = require("./routes/phoneOtp");
const imageRoutes = require("./routes/onlyImageRoutes");
const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const placeOrderRoutes=require("./routes/placeorderAddressRoutes");
const ordersRoutes=require("./routes/orderRoutes");
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
app.use("/restaurant", restaurantRoutes);
app.use("/image_add", imageRoutes);
app.use("/food", foodRoutes);
app.use("/payment", paymentRoutes);
app.use('/place',placeOrderRoutes);
app.use('/order',ordersRoutes);
const db=require("./db");



app.get("/getTablesWithColumns", async (req, res) => {
  try {
    const [tables] = await db.query(`SHOW TABLES`);

    const key = Object.keys(tables[0])[0];  

    const result = [];

    for (let table of tables) {
      const tableName = table[key];

      const [columns] = await db.query(`
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY, IS_NULLABLE
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = ?
      `, [tableName]);

      result.push({
        tableName,
        columns
      });
    }

    res.status(200).json({
      message: "Tables with their columns",
      data: result
    });

  } catch (err) {
    console.error("Fetch tables & columns error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use(express.urlencoded({ extended: true }));


 





app.get("/rating/:user_id", async (req, res) => {
    try {
        const id = req.params.user_id;
        const viewQuery = "SELECT * FROM product_rating WHERE user_id = ?";
        const [rows] = await db.query(viewQuery, [id]);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            message: "database fetching error: " + error,
        });
    }
});



app.post("/add_data/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const {
            res_id,
            product_name,
            experience,
            rating
        } = req.body;

        const insertQuery = `
            INSERT INTO product_rating 
            (user_id, res_id, product_name, experience, rating)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(insertQuery, [
            user_id,
            res_id,
            product_name,
            experience,
            rating
        ]);

        res.status(201).json({ message: "Rating Added", data: result.insertId });

    } catch (error) {
        res.status(500).json({ message: "Error: " + error });
    }
});

app.delete("/delete_data/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQuery = `
            DELETE FROM product_rating 
            WHERE id = ?
        `;

        const [result] = await db.query(deleteQuery,[id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ message: "Rating Deleted Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error: " + error });
    }
});



app.get("/favourites/:id", (req, res) => {
    const id = req.params.id;  

    const sql = `
        SELECT f.fevo_id, r.*
        FROM favourites f
        JOIN restaurant_details r ON f.res_id = r.res_id
        WHERE f.id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});


// ADD favourite
app.post("/add-favourite", (req, res) => {
    const { id, res_id } = req.body;


    db.query("SELECT * FROM user_info WHERE id = ?", [id], (err, user) => {
        if (err) return res.status(500).json(err);
        if (!user.length) return res.status(400).json({ error: "User does not exist" });

    
        db.query("SELECT * FROM restaurant_details WHERE res_id = ?", [res_id], (err, rest) => {
            if (err) return res.status(500).json(err);
            if (!rest.length) return res.status(400).json({ error: "Restaurant does not exist" });

        
            const sql = "INSERT INTO favourites (id, res_id) VALUES (?, ?)";
            db.query(sql, [id, res_id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Added to favourites", favourite_id: result.insertId });
            });
        });
    });
});


// DELETE favourite
app.delete("/favourite/:fevo_id", (req, res) => {
    const fevo_id = req.params.fevo_id;
    const sql = "DELETE FROM favourites WHERE fevo_id = ?";
    db.query(sql, [fevo_id], (err) =>
        err ? res.status(500).json(err) : res.json({ message: "Removed from favourites" })
    );
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) return console.error("server error :" + err.message);
    console.log(`server running on port ${PORT}`);
});
