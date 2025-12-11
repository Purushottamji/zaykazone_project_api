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

module.exports={plasceorderAddressGet,placeorderAddressAdd};
