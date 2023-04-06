const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const { isLoggedIn } = require("../middleware");

const router = express.Router();

// show all the products
router.get("/products", async (req, res) => {
  const products = await Product.find({});
  const message = req.flash("success");
  // res.render('./products/product', {products});
  res.render("./products/product", { products, message });
});

router.get("/products/new", (req, res) => {
  res.render("./products/new.ejs");
});

router.post("/products", async (req, res) => {
  const { name, img, desc, price } = req.body;
  await Product.create({ name, img, desc, price });
  req.flash("success", "Your product has been created successfully");
  res.redirect("/products");
});

// show a single product
router.get("/products/:productid", isLoggedIn, async (req, res) => {
  const { productid } = req.params;
  const product = await Product.findById(productid).populate("review");
  const updateMessage = req.flash("update");
  res.render("./products/show", { product, updateMessage });
});

// edit a single product
router.get("/products/:productid/edit", isLoggedIn, async (req, res) => {
  const { productid } = req.params;
  const product = await Product.findById(productid);
  res.render("./products/edit", { product });
});

// update a single product
router.patch("/products/:productid", async (req, res) => {
  const { name, img, desc, price } = req.body;
  const { productid } = req.params;
  await Product.findByIdAndUpdate(productid, { name, img, desc, price });
  req.flash("update", "Your product has been updated successfully");
  res.redirect(`/products/${productid}`);
});

// delete a particular product
router.delete("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  await Product.findByIdAndDelete(productid);
  res.redirect("/products");
});

// Adding the product in the cart
router.post("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  const user = req.query.user;

  const userObj = await User.findById(user);
  const pdtObj = await Product.findById(productid);

  let qty = 0;
  let flag = false;

  if (userObj.cart.length > 0) {
    userObj.cart.map(async (item) => {
      if (item.productName === pdtObj.name) {
        flag = true;
        qty = item.quantity;
        item.quantity = qty + 1;
        await userObj.save();
      }
    });
  } else {
    flag = true;
    const cartObj = {
      productImg: pdtObj.img,
      productName: pdtObj.name,
      price: pdtObj.price,
      quantity: qty + 1,
    };
    await userObj.cart.push(cartObj);
    await userObj.save();
  }

  if (!flag) {
    const cartObj = {
      productImg: pdtObj.img,
      productName: pdtObj.name,
      price: pdtObj.price,
      quantity: qty + 1,
    };
    await userObj.cart.push(cartObj);
    await userObj.save();
  }
  res.redirect(`/products/${productid}`);
});

router.get("/cart", isLoggedIn, (req, res) => {
  const userid = req.query.userid;

  User.findById(userid)
    .then((userObj) => {
      res.render("./products/cart", { arr: userObj.cart });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/products");
    });
});

router.post("/cart/:productName", async (req, res) => {
  const { productName } = req.params;
  const userid = req.query.userid;

  User.findById(userid)
    .then((user) => {
      user.cart.map(async (item) => {
        if (item.productName === productName) {
          let qty = item.quantity;
          if (qty == 1) {
            let idx = user.cart.indexOf(item);
            user.cart.splice(idx, 1);
            await user.save();
          } else {
            item.quantity = qty - 1;
            await user.save();
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect(`/cart?userid=${userid}`);
});

module.exports = router;
