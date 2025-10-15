import mongoose from "mongoose";
import  JsonWebToken  from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username : {
        type:String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"}],

    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshTocken: {
        type: String
    }
},{timestamps:true})

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

UserSchema.method.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password,this.password)
}

UserSchema.method.generateAccessToken = async function() {
    return await JsonWebToken.sign({

        _id:this._id,
        email:this.email,
        username: this.username,
        fullname:this.fullname
    }),
    process.env.ACCESS_TOKEN_SECRET,
    {
        expireIn: process.env.ACCESS_TOCKEN_EXPIRY
    }
}

UserSchema.method.generateRefreshToken = async function() {
    return await JsonWebToken.sign({

        _id:this._id,
        email:this.email,
        username: this.username,
        fullname:this.fullname
    }),
    process.env.REFRESH_TOKEN_SECRET,
    {
        expireIn: process.env.REFRESH_TOCKEN_EXPIRY
    }
}

export const User = mongoose.model("User",UserSchema);