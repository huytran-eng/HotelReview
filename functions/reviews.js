const Review = require('../models/reviews')
const Hotel = require('../models/hotel')

module.exports.createReview = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    hotel.reviews.push(review)
    await review.save()
    await hotel.save()
    req.flash('success', 'da them danh gia moi')
    res.redirect(`/hotels/${hotel._id}`)
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'xoa danh gia thanh cong')
    res.redirect(`/hotels/${id}`);
}