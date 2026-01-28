// middlewares/optionalVerifyJWT.js
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js" 
  
export const optionalVerifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
      req.user = null;   
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id)
      .select("-password -refreshToken");

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
