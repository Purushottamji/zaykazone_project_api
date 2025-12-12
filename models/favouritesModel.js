const db = require("../db");

module.exports = {
    getFavouritesByUser(id) {
        const sql = `
            SELECT f.fevo_id, r.res_id, r.name, r.location
            FROM favourites f
            JOIN restaurant_details r ON f.res_id = r.res_id
            WHERE f.id = ?
        `;
        return db.query(sql, [id]);
    },

    checkUser(id) {
        return db.query("SELECT * FROM user_info WHERE id = ?", [id]);
    },

    checkRestaurant(res_id) {
        return db.query("SELECT * FROM restaurant_details WHERE res_id = ?", [res_id]);
    },

    checkFavouriteExists(id, res_id) {
        return db.query(
            "SELECT * FROM favourites WHERE id = ? AND res_id = ?",
            [id, res_id]
        );
    },

    addFavourite(id, res_id) {
        return db.query(
            "INSERT INTO favourites (id, res_id) VALUES (?, ?)",
            [id, res_id]
        );
    },

    getFavouriteById(fevo_id) {
        return db.query("SELECT * FROM favourites WHERE fevo_id = ?", [fevo_id]);
    },

    deleteFavourite(fevo_id) {
        return db.query("DELETE FROM favourites WHERE fevo_id = ?", [fevo_id]);
    }
};
