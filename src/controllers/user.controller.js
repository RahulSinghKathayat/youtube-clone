import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const generateRefreshAndAccessToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "something went wrong while generating the refresh and access token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const { fullName, email, username, password } = req.body
    if([fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all fields are required")
    }
    const existedUser = await User.findOne({
        $or : [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with this email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    // if(!avatarLocalPath){
    //     throw new ApiError(400, "avatar is required")
    // }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if(!avatar){
    //     throw new ApiError(400, "Avatar file is required")
    // }
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
    
})

const loginUser = asyncHandler(async(req, res) => {
    const { username, email, password } = req.body

    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "password is error")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


const options = {
    httpOnly: true,
    secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200,{
                user: loggedInUser, accessToken, refreshToken
            }, "user loggedIn successfully"
        )
    )
})


const logoutUser = asyncHandler(async(req, res) => {

})

export { 
    registerUser, 
    loginUser,
    logoutUser }