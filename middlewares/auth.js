const jwt = require("jsonwebtoken");
require("dotenv").config();

function userAuth(req,res,next){
    const token = req.headers.token;

    try{
        const decodedData = jwt.verify(token,process.env.JWT_User);
        req.userid = decodedData.id;
        next();
    } catch(error){
        res.status(403).json({
            message : "verification failed"
        });
    }
}

function adminAuth(req,res,next){
    const token = req.headers.token;
    try{
        const decodedData = jwt.verify(token , process.env.JWT_Admin);
        req.adminid = decodedData.id;
        next();
    } catch (error){
        res.status(403).json({
            message : "verification failed"
        });
    }
}

module.exports = {
    userAuth,
    adminAuth
};