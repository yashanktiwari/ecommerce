const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

router.post('/products/:productid/review', async (req, res) => {
  const {productid} = req.params;
  const {rating, review} = req.body;
  // Adding the review in the database
  let pdtReview = await Review.create({rating, review});

  const product = await Product.findById(productid);
  await product.review.push(pdtReview); // If we are adding pdtReview then mongoose will add only the object
  
  await product.save();
  
  res.redirect(`/products/${productid}`);
});

module.exports = router;