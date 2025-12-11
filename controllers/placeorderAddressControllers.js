const database =require("../db");

const plasceorderAddressGet=async(req,res)=>{
    try{
        const id =req.params.user_id;
        const viewQuery="SELECT * FROM placeorderAddress WHERE user_id=?"
        const [rows]=await database.query(viewQuery,[id]);
        res.status(200).json(rows)
    }
    catch(error){
        res.status(500).json({
            massage:"database fatching error"+error
        })
        
    }

}
const placeorderAddressAdd=async(req,res)=>{
    try{
        const {user_id,land_mark,state,pin_code,district,mobile_number,full_address}=req.body;

        const insertQuery =`INSERT INTO placeorderAddress
        (user_id,land_mark,state,pin_code,district,mobile_number,full_address)
         VALUES(?,?,?,?,?,?,?)`;
        const [rows]=await database.query(insertQuery,[
              user_id,
      land_mark,
      state,
      pin_code,       
      district,
      mobile_number,
      full_address
        ]);
        res.status(200).json(rows)

    }
    catch(error){
       return res.status(500).json({
        massage:"database fatching error"+error

        });

    }

}

const placeorderAddressPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        const updateQuery = "UPDATE placeorderAddress SET ? WHERE id = ?";

        const [result] = await database.query(updateQuery, [body, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Address not found!" });
        }

        res.status(200).json({
            message: "Updated successfully",
            updated_data: body
        });

    } catch (error) {
        res.status(500).json({
            message: "Database update error: " + error
        });
    }
};





module.exports={plasceorderAddressGet,placeorderAddressAdd,placeorderAddressPatch,};
