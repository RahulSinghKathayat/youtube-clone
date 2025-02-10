import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async(req, res) => {
    const { fullName, email, username, password } = req.body
    if([fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all fields are required")
    }
    const existedUser = User.finOne({
        $or : [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with this email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })
    
})

export { registerUser }