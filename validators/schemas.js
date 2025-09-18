const { z } = require("zod");

const instructorSchema = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20)

});

const courseSchema = z.object({
    title : z.string().min(5).max(50),
    description : z.string().min(20).max(500),
    price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive()),
    imageUrl : z.string().url(),
    videoUrl: z.string().url().optional().or(z.literal('')),
});

const updatecourseSchema = z.object({
    title : z.string().min(5).max(50).optional(),
    description : z.string().min(20).max(500).optional(),
    price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive()).optional(),
    imageUrl : z.string().url().optional(),
    videoUrl: z.string().url().optional().or(z.literal(''))
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