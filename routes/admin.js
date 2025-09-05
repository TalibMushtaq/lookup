const { Router } = require("express");
const { adminModel, coursesModel } = require("../database");
const { adminSchema, courseSchema, updatecourseSchema } = require("../validators/schemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { adminAuth  } = require("../middlewares/auth");
const adminRouter = Router();
require("dotenv").config();


adminRouter.post("/signup", async function(req,res){
    const safeParsedData = adminSchema.safeParse(req.body);

    if(!safeParsedData.success){
        res.json({
            message : "Invalid Inpus",
            error  : safeParsedData.error
        });
        return;
    }
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await adminModel.findOne({email});
        if (existingUser){
            return res.status(409).json({
                message: "admin alredy exists "
            });
        }

        const hashedPassword = await bcrypt.hash(password,6);
        
        await adminModel.create({
            email,
            hashedPassword,
            firstName,
            lastName
        });

        res.status(201).json({
            message : "admin Created Successfully"
        });
    } catch (error) {
        console.error("signup error :", error);
        res.status(500).json({
            message : "Interanl server error"
        });
    }
});

adminRouter.post("/signin",async function(req,res){
    const safeparsedData = adminSchema.safeParse(req.body);

    if(!safeparsedData.success){
        res.json({
            message : "invalid Inputs",
            error : safeparsedData.error
        });
        return;
    }
    const { email, password } = req.body;
    
    const admin = await adminModel.findOne({ email });

    if(!admin){
        res.status(403).json({
            message : "You Do Not Have Admin Access",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password , admin.hashedPassword);
    if(passwordMatch) {
        const token = jwt.sign({
            id : admin._id.toString()
        },process.env.JWT_Admin);

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

adminRouter.post("/course",adminAuth,async function(req , res){
    try {
        const safeParsedData = courseSchema.safeParse(req.body);

        if(!safeParsedData.success){
            return res.json({
                message : "invalid input",
                error : safeParsedData.error
            });
        }

        const newCourse = await coursesModel.create({
            title : safeParsedData.data.title,
            description : safeParsedData.data.description,
            imageUrl : safeParsedData.data.imageUrl,
            creatorId : new mongoose.Types.ObjectId(req.adminid)
        });
        return res.json({
            message : "Task Created",
            courseId : newCourse._id.toString()
        });
    } catch(error){
        console.error("error while creating course :",error);
        return res.status(500).json({
            message : "error while creating course",
            error : error.message
        });
    }
});


adminRouter.put("/course/:courseId", adminAuth, async function(req, res) {
    
    try {
        const safeParsedData = updatecourseSchema.safeParse(req.body);
        const courseId = req.params.courseId.replace(/^:/, '');

        if (!safeParsedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                error: safeParsedData.error
            });
        }
        
        if (!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message : "Invalid course ID format",
                courseId : courseId
            });
        }
        
        const course = await coursesModel.findById(courseId);

        if(!course){
            return res.status(404).json({
                message : "Course not found",
                courseId : courseId
            });
        }

        if (course.creatorId.toString() !== req.adminid){
            return res.status(403).json({
                message : "Unauthorized: You cna only update courses you created"
            });
        }

        const updatedCourse = await coursesModel.findByIdAndUpdate(
            courseId,
            safeParsedData.data,
            {new : true, runValidators: true}
        );

        return res.status(200).json({
            message: "Course updated successfully",
            data : updatedCourse
        })
    } catch (error) {
        console.error("Error with updating the course:",error);
        return res.status(500).json({
            message : "Error while updating the course",
            error : error.message
        });
    }
});


adminRouter.get("/course/bulk",adminAuth, async function(req,res){
    try {
        const adminid = req.adminid;
        const courses = await coursesModel.find({ creatorId : adminid });

        res.status(200).json({
            message : "Courses retrived successful",
            courses : courses
        });
    } catch (error) {
        console.error("Error while fetching the courses",error);
        res.status(500).json({
            message : "Error while fetching the courses",
            error : error.message
        })
    }
});

module.exports = {
    adminRouter : adminRouter
}