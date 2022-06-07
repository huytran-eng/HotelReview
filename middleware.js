const Hotel = require('./models/hotel')
const ExpressError = require('./ultis/expressErrors')
const Review = require('./models/reviews')
const { hotelSchema, reviewSchema } = require('./schemas.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Chua dang nhap')
        return res.redirect('/login')
    }
    next()
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id)
    if (!hotel.author.equals(req.user._id)) {
        req.flash('error', 'khong duoc cho phep')
        return res.redirect(`/hotels/${id}`)
    }
    next()
}
module.exports.validateHotel = (req, res, next) => {
    const { error } = hotelSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next()
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next()
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'khong duoc cho phep')
        return res.redirect(`/hotels/${id}`)
    }
    next()
}
