const { z } = require("zod");

const instructorSchema = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20)

});

const courseSchema = z.object({
    title : z.string().min(5).max(20),
    description : z.string().min(20).max(100),
    imageUrl : z.string().url()
});

const updatecourseSchema = z.object({
    title : z.string().min(5).max(20).optional(),
    description : z.string().min(20).max(100).optional(),
    imageUrl : z.string().url().optional()
});

const userSchema = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20)
});
const userSignin = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16)
});
const instructorSignin = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16)
});




module.exports = {
    instructorSchema,
    instructorSignin,
    courseSchema,
    updatecourseSchema,
    userSchema,
    userSignin
}