const express = require('express')
const route = express.Router()
const  auth = require('../config/auth');
const isUser = auth.isUser;
// Get Product model
const Product = require('../models/product')

/*
 * GET add product to cart
 */
route.get('/add/:product',  function (req, res) {

     slug = req.params.product;

    Product.findOne({slug: slug}, function (err, p) {
        if (err)
            console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            })
        } else {
             cart = req.session.cart;
             newItem = true;

            for ( i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                })
            }
        }

       //console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    })

})

/*
 * GET checkout page
 */
route.get('/checkout', isUser,  function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        })
    }

})

/*
 * GET update product
 */
route.get('/update/:product', function (req, res) {

     slug = req.params.product;
     cart = req.session.cart;
     action = req.query.action;

    for ( i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

})

/*
 * GET clear cart
 */
route.get('/clear', function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

})

/*
 * GET buy now
 */
route.get('/buynow', isUser,  function (req, res) {

    //delete req.session.cart;
    
    res.sendStatus(200);

});

module.exports=route
