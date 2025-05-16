const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Product = require('../models/Product') // Ensure the Product model is correctly imported

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const productName = req.body.name.replace(/\s+/g, '_').toLowerCase()
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${productName}${ext}`)
  }
})

const upload = multer({ storage })

// POST /api/products - Create a product with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, stock, price } = req.body

    const imagePath = req.file ? `/uploads/${req.file.filename}` : ''

    const product = new Product({
      name,
      stock,
      price,
      image: imagePath
    })

    await product.save()
    res.status(201).json(product)
  } catch (err) {
    console.error('❌ Error saving product:', err)
    res.status(500).json({ error: 'Server error' })
  }
})


// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    console.error('❌ Error fetching products:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/products/:id - Update product stock
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { stock } = req.body

  try {
    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' })
    }

    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    product.stock = stock
    await product.save()

    res.json(product)
  } catch (error) {
    console.error('❌ Error updating stock:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await product.remove()
    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
