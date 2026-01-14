import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type : String,
        required : true
    },
    role:{
        type : String,
        enum: ["user", "admin"],
        default: "user"
    }
},{
    timestamps: true
})

const UserModel = mongoose.model("user", UserSchema)

export default UserModel;