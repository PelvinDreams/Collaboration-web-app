import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User  from "../models/auth/UserModel.js";


export const protect = asyncHandler( async (req, res, next) => {
    try {
        // check if user is logged in
        const token = req.cookies.token

        if(!token) {
            // 401 unauthorized
            res.status(401).json( { message: "Not authorized, please login" } );
        }
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    //    get users details from the token
    const user = await User.findById(decoded.id).select("-password");


    // check if user exist
    if(!user) {
        // 401 unauthorized
        res.status(401).json( { message: "User not found" } );
    }


    // set user details in the request object
    req.user = user;

    next();

    } catch (error) {
        // 401 unauthorized
        res.status(401).json( { message: "Not authorized, token failed" } );
    }
})

