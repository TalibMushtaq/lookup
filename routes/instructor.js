const { Router } = require("express");
const { instructorModel, coursesModel } = require("../database");
const { instructorSchema,instructorSignin, courseSchema, updatecourseSchema } = require("../validators/schemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");
const { instructorAuth } = authMiddleware;
const instructorRouter = Router();
require("dotenv").config();


instructorRouter.post("/signup", async function(req,res){
    const safeParsedData = instructorSignin.safeParse(req.body);

    if(!safeParsedData.success){
        res.json({
            message : "Invalid Inpus",
            error  : safeParsedData.error
        });
        return;
    }
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await instructorModel.findOne({email});
        if (existingUser){
            return res.status(409).json({
                message: "instructor alredy exists "
            });
        }

        const hashedPassword = await bcrypt.hash(password,6);
        
        await instructorModel.create({
            email,
            hashedPassword,
            firstName,
            lastName
        });

        res.status(201).json({
            message : "instructor Created Successfully"
        });
    } catch (error) {
        console.error("signup error :", error);
        res.status(500).json({
            message : "Interanl server error"
        });
    }
});

instructorRouter.post("/signin",async function(req,res){
    const safeparsedData = instructorSchema.safeParse(req.body);

    if(!safeparsedData.success){
        res.json({
            message : "invalid Inputs",
            error : safeparsedData.error
        });
        return;
    }
    const { email, password } = req.body;
    
    const instructor = await instructorModel.findOne({ email });

    if(!instructor){
        res.status(403).json({
            message : "You Do Not Have Instructor Access",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password , instructor.hashedPassword);
    if(passwordMatch) {
        const token = jwt.sign({
            id : instructor._id.toString()
        },process.env.JWT_Instructor);

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

instructorRouter.post("/course",instructorAuth,async function(req , res){
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
            creatorId : new mongoose.Types.ObjectId(req.instructorid)
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


instructorRouter.put("/course/:courseId", instructorAuth, async function(req, res) {
    
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

        if (course.creatorId.toString() !== req.instructorid){
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


instructorRouter.get("/course/bulk",instructorAuth, async function(req,res){
    try {
        const instructorid = req.instructorid;
        const courses = await coursesModel.find({ creatorId : instructorid });

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
    instructorRouter : instructorRouter
}