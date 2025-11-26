import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/users.models.js";

//Access token and refresh tokens are used at different places neef to generate so we created a method that can be reused

const generateAccessAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId)        //find the user in db
      const accessToken = user.generateAccessToken()  //generate accessToken the method is written in models
      const refreshToken = user.generateRefreshToken() //generate refreshToken used to get new access token after expired
      
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })     //stores refreshToken in db without validation

      return {accessToken, refreshToken}      //return acccess and refreshTokens

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
   }
}

const registerUser = asyncHandler(async(req, res) => {
   
    //get the user details 
     const{fullName, email, contactNo, gender, password} = req.body;  //from data will get in req.body
     //console.log(email);

     //check the validations
     if(!fullName || !email || !contactNo || !gender || !password){
        throw new ApiError(400, "All fields are required");
     }

     //check if user already exists so we have to import User from models
    const existedUser = await User.findOne({    //check if email or contactNo already exists
        $or: [{ email } , { contactNo}]
     })

     if(existedUser){
        throw new ApiError(409, "User with this email or ContactNo already existed")
     }

     //if all right then create user in the database (Only mongoose User is talking to the database)
     const user = await User.create({
      fullName,
      email,
      contactNo,
      gender,
      password
     })
     //do not return password so we are removing password and refreshToken
     const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
     )

     if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering User")
     }

     //return response
     return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
     )
})

const loginUser = asyncHandler(async(req, res) => {
   const {email, contactNo, password} = req.body;   //takes the input from the user

   if(!(email || contactNo)){       //check validations
      throw new ApiError(400, "Email or Contact No. is required field");
   }

   const user = await User.findOne({    //check the email or contactNo id registered or not
      $or: [{ email }, { contactNo }]
   })

   if(!user){          //Throw error if user doesnt registered
      throw new ApiError(404, "User doesn't exits")
   }

   //we created method in models to check password
   const isPasswordValid =  await user.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401, "Invalid User credentials")
   }

   //destructure access and refresh tokens from generateAccessAndRefreshToken method
   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

   //password or refresh token ni bhejna h
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   //send cookies
   const options = {
      httpOnly: true,     //ye true krne se cookies ko dekh skta h but modify ni kr payega
      secure : true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)   //in this cookie .cookie("ab", cd)  here ab is key and cd is value
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken
         },
         "User logged in successfully"
      )
   )
})

export {registerUser , loginUser , generateAccessAndRefreshTokens};