const db = require("../db");

const createUser = async ({ name, email, mobile, password, user_pic }) => {
    const sql = `INSERT INTO user_info(name, email, mobile, password, user_pic) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [name, email, mobile, password, user_pic]);
    return { insertId: result.insertId };
}
const updateUser = async ({ id, name, email, mobile, password, user_pic }) => {
    const sql = `
        UPDATE user_info 
        SET name = ?, email = ?, mobile = ?, password = ?, user_pic = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
        name,
        email,
        mobile,
        password,
        user_pic,
        id
    ]);

    return result.affectedRows > 0;
};
 


const findUserByEmail = async (email) => {
    const sql = `SELECT id, name, email, mobile, password, user_pic FROM user_info WHERE email = ? LIMIT 1`;
    const [rows] = await db.execute(sql, [email]);
    return rows.length ? rows[0] : null;
}

const findUserByMobile = async (mobile) => {
    const sql = `SELECT * FROM user_info WHERE mobile = ? LIMIT 1`;
    const [rows] = await db.execute(sql, [mobile]);
    return rows.length ? rows[0] : null;
};

const findUserById = async (id) => {
    const sql = `SELECT id, name, email, mobile, user_pic FROM user_info WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute(sql, [id]);
    return rows.length ? rows[0] : null;
};

const getAllUsers = async () => {
    const sql = `SELECT id, name, email, mobile, user_pic FROM user_info ORDER BY name`;
    const [rows] = await db.execute(sql);
    return rows;
}

module.exports = { createUser, findUserByEmail, findUserById, getAllUsers, updateUser ,findUserByMobile};