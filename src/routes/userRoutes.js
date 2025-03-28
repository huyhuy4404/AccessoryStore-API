const express = require('express');
const router = express.Router();
const { 
    getAllUsers,
    getUserById,
    postCreateAdmin,
    postCreateCustomer,
    loginUser,
    getUserByUserName,
    getUserByEmail
} = require('../controllers/userController');
const { authMiddleware, authorizeAdmin } = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware, authorizeAdmin, getAllUsers);
router.get('/users/username/:username', getUserByUserName);
router.get('/users/email/:email', getUserByEmail);
router.post('/users/admin', authMiddleware, authorizeAdmin, postCreateAdmin);
router.post('/users/customer', postCreateCustomer);
router.get('/users/:id', authMiddleware, getUserById);
router.post('/login', loginUser);


module.exports = router;
