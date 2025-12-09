const db=require("../db");

const addImage = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : null;
    const sql = `INSERT INTO allimage(image) VALUE (?)`;
    const [result] = await db.query(sql, [image]);
    res.status(201).json({
      message: "Restaurant added successfully",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("post image failed:"+err);
  res.status(500).json({
      message: "Server error",
    });
  }
}


module.exports={addImage};