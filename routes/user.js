const {Router, express } = require("express");
const { userModel, purchasedModel } = require("../database");
const { userSchema, userSignin } = require("../validators/schemas");
const { userAuth  } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const userRouter = Router();


userRouter.post("/signup", async function(req,res){
    const safeParsedData = userSchema.safeParse(req.body);

    if(!safeParsedData.success){
        res.json({
            message : "Invalid Inpus",
            error  : safeParsedData.error
        });
        return;
    }
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await userModel.findOne({email});
        if (existingUser){
            return res.status(409).json({
                message: "user alredy exists "
            });
        }

        const hashedPassword = await bcrypt.hash(password,6);
        
        await userModel.create({
            email,
            hashedPassword,
            firstName,
            lastName
        });

        res.status(201).json({
            message : "User Created Successfully"
        });
    } catch (error) {
        console.error("signup error :", error);
        res.status(500).json({
            message : "Interanl server error"
        });
    }
});

userRouter.post("/signin", async function(req,res){

    const safeparsedData = userSignin.safeParse(req.body);

    if(!safeparsedData.success){
        res.json({
            message : "invalid Inputs",
            error : safeparsedData.error
        });
        return;
    }
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });

    if(!user){
        res.status(403).json({
            message : "You are not signed in",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password , user.hashedPassword);

    if(passwordMatch) {
        const token = jwt.sign({
            id : user._id.toString()
        },process.env.JWT_User);

        res.status(201).json({
            token,
            message : "You are Signed in"
        });
    } else {
        res.status(403).json({
            message : "Incorrect credentials"
        });
    }
});

userRouter.get("/purchased", userAuth, async function(req,res){
    try{
        const userid = req.userid;
        const purchasedCourses = await purchasedModel.find({ userid : userid });

        res.status(200).json({
            message : "Purchased courses",
            purchasedCourses : purchasedCourses
        });
    } catch {
        console.error("Error while fetching Purchased courses");
        res.status(500).json({
            message : "Error while fetching Purchased courses",
            userid: userid
        });
    }
});

module.exports = {
    userRouter : userRouter
}