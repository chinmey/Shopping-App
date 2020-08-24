const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const config=require('./config/databse')
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator=require('express-validator')
const fileUpload = require('express-fileupload')
const passport = require('passport')


//connecting to db
mongoose.connect(config.database,{ useNewUrlParser: true , useUnifiedTopology: true } )
mongoose.set('useFindAndModify', false)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb")
})

const app=express();

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set("view engine","ejs")

//public folder
app.use(express.static(path.join(__dirname, 'public')))

// Set global errors variable
app.locals.errors = null;

// Get Page Model
const Page = require('./models/page');

// Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
})

// Get Category Model
const Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
})

// Express fileUpload middleware
app.use(fileUpload());

// body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//express-session middlewares
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
   // cookie: { secure: true }
  }))

  //express validator middlewares
 .use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
      customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

//express-messages middlewares
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(expressValidator());

app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
 })


//set routes
const pages=require('./routes/pages')
const products = require('./routes/products')
const cart=require('./routes/cart')
const users = require('./routes/users')
const adminPages=require('./routes/admin_pages')
const adminCategories=require('./routes/admin_categories')
const adminProducts=require('./routes/admin_products')

app.use('/admin/pages',adminPages)
app.use('/admin/categories',adminCategories)
app.use('/admin/products', adminProducts)
app.use('/products', products)
app.use('/cart',cart)
app.use('/users',users)
app.use('/',pages)


app.listen(2020,()=>console.log('the server is started at http://localhost:2020'))
