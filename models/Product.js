// Schema
// name
// img  url
// price
// description

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
  name: {
    type: String
  },
  img: {
    type: String
  },
  price: {
    type: Number
  },
  desc: {
    type: String
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;