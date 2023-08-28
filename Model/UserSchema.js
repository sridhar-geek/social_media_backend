import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema( {
    firstName: {
        type: String,
        required: [true, 'Please mention first name'],
        min:3,
        max:30
    },
    surName: {
        type: String,
        required: [true, 'Please mention surname'],
        min:3,
        max:30
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        max:33,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    'Please give a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide passwword'],
        min: 8,
    },
    picturePath: {
        type: String,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    locaation: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number

},  { timestamps: true } );     // when we use timestamps it will automatically creates createdAt, updatedAt feilds in model



        /** Middleware
 * Mongoose provides middleware which helps to mainpulate the elements/feilds before saving into database
 * there are some other middlewares there, to do operations after saving the fields 
 */

// this pre middleware used to change data before saving
// here we're hashing password & adding dummy values to viewprofile and impressions
UserSchema.pre( 'save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash( this.password, salt )
    this.viewedProfile =  Math.floor(Math.random()*100)
    this.impressions =   Math.floor(Math.random()*100)
});

// creating a token for the user
UserSchema.methods.createJWT = function(){
    const token = jwt.sign( {userId: this._id, name: this.firstName }, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRE_TIME } )
    return token
};

// comparing password or verifying password
UserSchema.methods.comparePassword = async function (givenPassword){
    const isCorrect = await bcrypt.compare( givenPassword, this.password )
    return isCorrect
};

const User = mongoose.model('User', UserSchema)

export default User;