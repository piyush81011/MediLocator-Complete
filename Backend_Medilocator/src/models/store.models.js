import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const storeSchema = new Schema(
    {
        storeName:{
            type: String,
            required: true,
            index: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        contactNo: {
            type: String,
            required: true,
            maxlength: 10,
            minlength: 10
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    })

storeSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})  

//comparing the plain password text to the encrypted password in the database to login user
storeSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

//jwt is used to send requests securely from client to server and also used to authorize the user
storeSchema.methods.generateAccessToken = function(){
     return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//access token is short lived like 30min but refresh token is for 30 days it renews the access token when it expires
storeSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Store = mongoose.model("Store", storeSchema);