import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({
    path: "../utils/.env"
})

export const isAuthenticated = async (req, res, next)=>{
try {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            massage: "User not athenticated",
            success: false
        })
    };

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log(decodedToken);
    req.user = decodedToken.userId;
    // console.log(req.user);
    
    
    next();
} catch (error) {
    console.log(error); 
}
}