require("dotenv").config();
const mongoose = require("mongoose");
async function connect(){
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db")
} 

connect()


const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
    email : { type : String , unique : true , required : true },
    hashedPassword : {type : String , required : true},
    firstName : { type : String , required : true},
    lastName : { type : String , required : true }
});

const adminSchema = new Schema({
    email : { type : String , unique : true , required : true },
    hashedPassword : {type : String , required : true},
    firstName : { type : String , required : true},
    lastName : { type : String , required : true }
});

const courseSchema = new Schema({
    title : String,
    description : String,
    imageUrl : String,
    creatorId : ObjectId,
},{ timestamps: true }
);



const purchasedSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId,
},{ timestamps: true }
);

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const coursesModel = mongoose.model("courses",courseSchema);
const purchasedModel = mongoose.model("purchased",purchasedSchema);

module.exports = {
    userModel,
    adminModel,
    coursesModel,
    purchasedModel
}