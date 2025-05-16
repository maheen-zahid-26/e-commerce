const Product = require('../models/Product')

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const product = new Product({ name, description, price, stock, category, image })
    await product.save()

    res.status(201).json({ message: 'Product added', product })
  } catch (error) {
    console.error('Error adding product:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params
    const { stock } = req.body

    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' })
    }

    const product = await Product.findByIdAndUpdate(id, { stock }, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })

    res.json(product)
  } catch (error) {
    console.error('Error updating stock:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
