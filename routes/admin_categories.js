const express=require('express')
const route=express.Router()
const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

//require page
const Category=require('../models/category')

/*
 * GET category index
 */
route.get('/', isAdmin, function (req, res) {
    Category.find(function (err, categories) {
        if (err)
            return console.log(err);
        res.render('admin/categories', {
            categories: categories
        })
    })
})



/*
 * GET add category
 */
route.get('/add-category', isAdmin, function (req, res) {

     title = "";

    res.render('admin/add_category', {
        title: title
    });

});

/*
 * POST add category
 */
route.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    title = req.body.title;
    slug = title.replace(/\s+/g, '-').toLowerCase();

    errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        })
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', {
                    title: title
                })
            } else {
                category = new Category({
                    title: title,
                    slug: slug
                })

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    })

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
                })
            }
        })
    }

})


/*
 * GET edit category
 */
route.get('/edit-category/:id', isAdmin,function (req, res) {

    Category.findById(req.params.id, function (err, category) {
        if (err)
            return console.log(err);

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        })
    })

})

/*
 * POST edit category
 */
route.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

     title = req.body.title;
     slug = title.replace(/\s+/g, '-').toLowerCase();
     id = req.params.id;

    errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        })
    } else {
        Category.findOne({slug: slug, _id: {'$ne': id}}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                })
            } else {
                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);

                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err)
                            return console.log(err);

                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        })

                        req.flash('success', 'Category edited!');
                        res.redirect('/admin/categories/edit-category/' + id);
                    })

                })


            }
        })
    }

})

/*
 * GET delete category
 */
route.get('/delete-category/:id', isAdmin, function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        })

        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categories/');
    })
})



module.exports=route