const express = require('express');
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware');

const router = express.Router();

// show all the products
router.get('/products', async (req, res) => {
  const products = await Product.find({});
  const message = req.flash('success');
  // res.render('./products/product', {products});
  res.render('./products/product', {products, message});
});

router.get('/products/new', (req, res) => {
  res.render('./products/new.ejs');
});

router.post('/products', async(req, res) => {
  const {name, img, desc, price} = req.body;
  await Product.create({name, img, desc, price});
  req.flash("success", "Your product has been created successfully");
  res.redirect('/products');
});

// show a single product
router.get('/products/:productid', isLoggedIn, async (req, res) => {
  const {productid} = req.params;
  const product = await Product.findById(productid).populate('review');
  const updateMessage = req.flash('update');
  res.render('./products/show', {product, updateMessage});
});

// edit a single product
router.get('/products/:productid/edit', isLoggedIn, async (req, res) => {
  const {productid} = req.params;
  const product = await Product.findById(productid);
  res.render('./products/edit', {product});
})

// update a single product
router.patch('/products/:productid', async (req, res) => {
  const {name, img, desc, price} = req.body;
  const {productid} = req.params;
  await Product.findByIdAndUpdate(productid, {name, img, desc, price});
  req.flash("update", "Your product has been updated successfully");
  res.redirect(`/products/${productid}`);
});

// delete a particular product
router.delete('/products/:productid', async (req, res) => {
  const {productid} = req.params;
  await Product.findByIdAndDelete(productid);
  res.redirect('/products');
});



module.exports= router;