const { sql, poolPromise } = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Categories');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategoriesById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Categories WHERE CategoryID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const postCreateCategories = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid category name' });
        }

        const pool = await poolPromise;
        await pool
            .request()
            .input('name', sql.NVarChar, name)
            .query('INSERT INTO Categories (CategoryName) VALUES (@name)');

        res.status(201).json({ message: 'Category created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const putUpdateCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid category name' });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .query('UPDATE Categories SET CategoryName = @name WHERE CategoryID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCategories = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Categories WHERE CategoryID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const searchCategoriesByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid category name' });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Categories WHERE CategoryName LIKE N\'%\' + @name + N\'%\'');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




module.exports = { getAllCategories, getCategoriesById, postCreateCategories, putUpdateCategories, deleteCategories,searchCategoriesByName };
