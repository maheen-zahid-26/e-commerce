const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String, 
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true 
})

module.exports = mongoose.model('Product', productSchema)
