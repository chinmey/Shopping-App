const express = require('express')
const route = express.Router()
const fs=require('fs-extra')
const  auth = require('../config/auth');
const isUser = auth.isUser;


//get product model
const Product=require('../models/product')  

//get category model
const Category=require('../models/category')

/*
 * GET /
 */
route.get('/', function (req, res) {
  //route.get('/', isUser, function (req, res) {  
    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products:products
        })
    })
    
})

/*
 * GET products by category
 */
route.get('/:category', function (req, res) {

    const categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            })
        })
    })

})

/*
 * GET product details
 */
route.get('/:category/:product', function (req, res) {

    var galleryImages = null;
        loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                        
                    })
                }
            })
        }
    })

})

module.exports=route