const Hotel = require('../models/hotel')
const { cloudinary } = require('../cloudinary')
const { hotelSchema } = require('../schemas')



module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({})
    res.render('hotels/index', { hotels })
}
module.exports.renderNew = (req, res) => {
    res.render('hotels/new')
}
module.exports.createNew = async (req, res) => {
  
    const hotel = new Hotel(req.body.hotel);
    hotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    hotel.author = req.user._id
    await hotel.save()
    req.flash('success', 'da tao hotel moi')
    res.redirect(`/hotels/${hotel._id}`)
}
module.exports.show = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!hotel) {

        req.flash('error', 'khong tim thay ')
        return res.redirect('/hotels')
    }
    res.render('hotels/show', { hotel })
}

module.exports.renderEdit = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel) {

        req.flash('error', 'khong tim thay ')
        return res.redirect('/hotels')
    }
    res.render('hotels/edit', { hotel })
}
module.exports.edit = async (req, res) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { ...req.body.hotel })
    if (!hotel) {
        req.flash('error', 'khong tim thay ')
        return res.redirect('/hotels')
    }
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    hotel.images.push(...imgs)
    await hotel.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await hotel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'thay doi thanh cong')

    res.redirect(`/hotels/${hotel._id}`)
}
module.exports.delete = async (req, res) => {
    await Hotel.findByIdAndDelete(req.params.id)
    req.flash('success', 'da xoa thanh cong')

    res.redirect('/hotels')
}