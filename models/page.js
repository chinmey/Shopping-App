const mongoose = require('mongoose');

// Page Schema
 PageSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
    
});

Page = module.exports = mongoose.model('Page', PageSchema);

