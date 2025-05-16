const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const productName = req.body.name?.replace(/\s+/g, '_').toLowerCase() || 'product';
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${productName}${ext}`);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', productController.getAllProducts);
router.post('/', upload.single('image'), productController.addProduct);
router.put('/:id', productController.updateStock);
router.delete('/:id', productController.deleteProduct); 

module.exports = router;
