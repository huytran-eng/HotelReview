const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    rating: Number
})
const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review