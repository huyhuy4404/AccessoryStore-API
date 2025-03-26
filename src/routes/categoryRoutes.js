const express = require('express');
const router = express.Router();
const { 
    getAllCategories,
    getCategoriesById,
    putUpdateCategories,
    postCreateCategories,
    deleteCategories,
    searchCategoriesByName
} = require('../controllers/categoryController');
const { authMiddleware, authorizeAdmin } = require('../middlewares/authMiddleware');

router.get('/categories', getAllCategories);
router.get('/categories/search', searchCategoriesByName);
router.get('/categories/:id',getCategoriesById);
router.post('/categories', authMiddleware, postCreateCategories);
router.put('/categories/:id', authMiddleware, putUpdateCategories);
router.delete('/categories/:id', authMiddleware, deleteCategories);

module.exports = router;
