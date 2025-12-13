    const Favourites = require("../models/favouritesModel");

    module.exports = {
        // GET favourites
        async getFavourites(req, res) {
            try {
                const { fev_id } = req.params;
                const [rows] = await Favourites.getFavouritesByUser(fev_id);
                res.json(rows);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err instanceof Error ? err.message : err });
            }
        },

        // ADD favourite
        async addFavourite(req, res) {
            try {
                const { fev_id, res_id } = req.body;

                const [user] = await Favourites.checkUser(fev_id);
                if (!user.length) return res.status(400).json({ error: "User does not exist" });

                const [restaurant] = await Favourites.checkRestaurant(res_id);
                if (!restaurant.length) return res.status(400).json({ error: "Restaurant does not exist" });

                const [result] = await Favourites.addFavourite(fev_id, res_id);
                res.json({ message: "Added to favourites", favourite_id: result.insertId });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err instanceof Error ? err.message : err });
            }
        },

        // DELETE favourite
        async deleteFavourite(req, res) {
            try {
                const { fev_id } = req.params;
                await Favourites.deleteFavourite(fev_id);
                res.json({ message: "Removed from favourites" });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err instanceof Error ? err.message : err });
            }
        }
    };
