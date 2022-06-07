const mongoose = require('mongoose')
const Review = require('./reviews')
const HotelSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    title: String,
    price: Number,
    images: [{
        url: String,
        filename: String
    }],
    location: String,
    description: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

HotelSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }

        })
    }
})
const Hotel = mongoose.model('Hotel', HotelSchema)
module.exports = Hotel