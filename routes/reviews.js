const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../ultis/catchAsync')
const { isReviewAuthor, validateReview, isLoggedIn } = require('../middleware')
const review = require('../functions/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))
module.exports = router