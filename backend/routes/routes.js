const express = require("express");
const conn = require("../utlis/db");

const router = express.Router();

// register user data
router.post("/create", async (req, res) => {
    const { first_name, middle_name, last_name, email, phone_1, phone_2, address } = req.body;

    if (!first_name || !middle_name || !last_name || !email || !phone_1 || !phone_2 || !address) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        const [result] = await conn.query("INSERT INTO users SET ?", { first_name, middle_name, last_name, email, phone_1, phone_2, address });
        
        return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// get userdata
router.get("/getusers", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const [rows] = await conn.query("SELECT * FROM users LIMIT ?, ?", [offset, limit]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


// user delete api
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await conn.query("DELETE FROM users WHERE id = ?", [id]);
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// get single user
router.get("/induser/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// update users api
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await conn.query("UPDATE users SET ? WHERE id = ?", [data, id]);
        return res.status(200).json({ success: true, message: "User updated successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});


module.exports = router;
