const { sql, poolPromise } = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM Users WHERE UserID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const postCreateCustomer = async (req, res) => {
    try {
        const { username,email, password, fullName, phoneNumber } = req.body;

        if (!username || !email || !password || !fullName || !phoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await poolPromise;
        await pool
            .request()
            .input('username',sql.NVarChar,username)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, hashedPassword)
            .input('fullName', sql.NVarChar, fullName)
            .input('phoneNumber', sql.NVarChar, phoneNumber)
            .query(`
                INSERT INTO Users (UserID, UserName, Email, PasswordHash, FullName, PhoneNumber, Role) 
                VALUES (NEWID(),@username, @email, @passwordHash, @fullName, @phoneNumber, 'Customer')
            `);

        res.status(201).json({ message: 'Customer created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const postCreateAdmin = async (req, res) => {
    try {
        const { username,email, password, fullName, phoneNumber } = req.body;

        if (!username || !email || !password || !fullName || !phoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await poolPromise;
        await pool
            .request()
            .input('username',sql.NVarChar,username)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, hashedPassword)
            .input('fullName', sql.NVarChar, fullName)
            .input('phoneNumber', sql.NVarChar, phoneNumber)
            .query(`
                INSERT INTO Users (UserID, UserName, Email, PasswordHash, FullName, PhoneNumber, Role) 
                VALUES (NEWID(),@username, @email, @passwordHash, @fullName, @phoneNumber, 'Admin')
            `);

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: "Username/Email and password are required" });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("identifier", sql.NVarChar, identifier)
            .query(`
                SELECT * FROM Users 
                WHERE Email = @identifier OR UserName = @identifier
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.Role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = { getAllUsers,getUserById,postCreateCustomer,postCreateAdmin,loginUser};
