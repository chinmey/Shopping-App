 mongoose = require('mongoose')

// Category Schema
 CategorySchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
    
})

 Category = module.exports = mongoose.model('Category', CategorySchema);

