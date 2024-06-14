const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);

