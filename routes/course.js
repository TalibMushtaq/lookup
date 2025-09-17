const { Router } = require("express");
const mongoose = require("mongoose"); // Ensure mongoose is imported
const { purchasedModel, coursesModel } = require("../database");
const { userAuth, instructorAuth  } = require("../middlewares/auth");
const { courseSchema } = require("../validators/schemas");
const { fromZodError } = require("zod-validation-error");

const courseRouter = Router();

courseRouter.post("/create", instructorAuth, async function (req, res) {
    const instructorId = req.instructorId;
    const courseData = req.body;

    const validationResult = courseSchema.safeParse(courseData);
    if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({
            message: validationError.message
        });
    }

    try {
        const newCourse = await coursesModel.create({
            ...validationResult.data,
            instructor: instructorId,
            published: true // Or handle as a separate step
        });

        res.status(201).json({
            message: "Course created successfully",
            courseId: newCourse._id
        });

    } catch (error) {
        console.error("Error occurred while creating the course", error);
        res.status(500).json({
            message: "Error while creating the course",
        });
    }
});

courseRouter.post("/purchase/:courseId", userAuth ,async function (req, res) {
    const userid = req.userid;

    try {
        const courseId = req.params.courseId;


        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID format",
                courseId: courseId,
            });
        }

        const purchasedCourse = await purchasedModel.create({
            userid: userid,
            courseId: courseId,
        });

        if (!purchasedCourse) {
            return res.status(404).json({
                message: "Course not found",
                courseId: courseId,
            });
        }

        res.status(201).json({
            message: "Course purchased successfully",
            purchasedCourse: purchasedCourse,
        });

    } catch (error) {
        console.error("Error occurred while processing the purchase", error);
        res.status(500).json({
            message: "Error while processing the course purchase",
        });
    }
});

courseRouter.get("/preview", async function(req,res){
    try {
        const courses = await coursesModel.find({});

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No courses available",
            });
        }
        res.status(200).json({
            message: "Courses retrieved successfully",
            courses: courses,
        });
    } catch (error){
        console.error("Error occurred while retrieving courses", error);
        res.status(500).json({
            message: "Error while fetching courses",
        })
    }
});

courseRouter.get("/all", async function(req,res){
    try {
        const courses = await coursesModel.find({ published: true }).populate('instructor', 'firstName lastName');

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No courses available",
            });
        }
        res.status(200).json({
            message: "Courses retrieved successfully",
            courses: courses,
        });
    } catch (error){
        console.error("Error occurred while retrieving courses", error);
        res.status(500).json({
            message: "Error while fetching courses",
        })
    }
});

module.exports = {
    courseRouter: courseRouter,
};
