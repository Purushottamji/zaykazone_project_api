const express=require("express");
const dotenv=require("dotenv");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const addressRoutes= require("./routes/addRoutes");
const database=require("./db");
dotenv.config();
const app=express();
app.use(express.json());

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/address",addressRoutes);

   app.get("/restaurant", async (req, res) => {
    try {
        const viewQuery = "SELECT * FROM restaurant_details";
        const [rows] = await database.query(viewQuery);
        
        res.status(200).json({ message: rows });
    } catch (error) {
        res.status(500).json({
            message: "database fetching error: " + error
        });
    }
});
app.post("/restaurant", async (req, res) => {
    try {
        const { name,image_url,description,food_details,address } = req.body;

       
        if (!name || !image_url || !description || !food_details || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const insertQuery = `
            INSERT INTO restaurant_details 
            (name,image_url,description,food_details,address) 
            VALUES (?, ?, ?,?,?)`;

        const [result] = await database.query(insertQuery, [
            name,image_url,description,food_details,address
        ]);

        res.status(201).json({
            message: "Restaurant added successfully",
            insertId: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Database inserting error: " + error
        });
    }
});
app.put("/restaurant/:res_id", async (req, res) => {
    try {
        const restaurantId = req.params.res_id;
        const { name, image_url, description, food_details, address } = req.body;

        
        if (!name || !image_url || !description || !food_details || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const updateQuery = `
            UPDATE restaurant_details 
            SET 
                name = ?, 
                image_url = ?, 
                description = ?, 
                food_details = ?, 
                address = ?
            WHERE res_id = ?`;

        const [result] = await database.query(updateQuery, [
            name,
            image_url,
            description,
            food_details,
            address,
            restaurantId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Database update error: " + error
        });
    }
});


app.delete("/restaurant/:res_id", async (req, res) => {
    try {
        const restaurantId = req.params.res_id;

        const deleteQuery = ` DELETE FROM restaurant_details WHERE res_id = ?`;

        const [result] = await database.query(deleteQuery, [restaurantId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            message: "Restaurant deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Database delete error: " + error
        });
    }
});





const PORT=process.env.PORT || 3000;
app.listen(PORT,(err)=>{
    if(err) return console.error("server error :"+err.message);
    console.log(`server running on port ${PORT}`);


})

