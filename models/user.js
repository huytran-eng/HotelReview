const { default: mongoose } = require('mongoose')
const mongose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)