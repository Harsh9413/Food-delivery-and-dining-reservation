// import jwt from "jsonwebtoken"


// const authMiddleware = async (req,res,next)=>{
//     const {token} = req.headers;
//     if (!token){
//         return res.json({success:false,message:"Not authorized login again!!"})
//     }
//     try {
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET);
//         req.body.userId = token_decode.id;
//         next();
//     } catch (error) {
//         console.log(error);
//         // console.log("JWT_SECRET:", process.env.JWT_SECRET);
//         res.json({success:false,message:process.env.JWT_SECRET})
//     }
// }

// export default authMiddleware;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const authMiddleware = async (req, res, next) => {
    try {
        console.log("🔹 Request Headers:", req.headers); // Debugging logs

        let token;

        // Extract token from Authorization header (preferred method)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // Fallback: Extract token from `token` header
        else if (req.headers.token) {
            token = req.headers.token;
        }

        // If no token found, return error
        if (!token) {
            console.error("No token found in headers");
            return res.status(401).json({ success: false, message: "Not authorized, login again!" });
        }

        // console.log(" Received Token:", token);
        // console.log(" Using JWT_SECRET:", process.env.JWT_SECRET || "Undefined");

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Token Decoded:", decoded);

        // Attach user ID to request body
        req.body.userId = decoded.id;

        next(); // Move to next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;
