const { z } = require("zod");
const { purchasedModel } = require("../database");
const course = require("../routes/course");
const { email } = require("zod/v4");
const adminSchema = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16),
    Name: z.string().min(3).max(20)
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
    Name: z.string().min(3).max(20)
});
const userSignin = z.object({
    email: z.string().max(25).email(),
    password: z.string().min(8).max(16)
});


module.exports = {
    adminSchema,
    courseSchema,
    updatecourseSchema,
    userSchema,
    userSignin
}