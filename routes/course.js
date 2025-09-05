const { Router } = require("express");
const mongoose = require("mongoose"); // Ensure mongoose is imported
const { purchasedModel, coursesModel } = require("../database");
const { userAuth  } = require("../middlewares/auth");

const courseRouter = Router();

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

module.exports = {
    courseRouter: courseRouter,
};
