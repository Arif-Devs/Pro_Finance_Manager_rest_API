import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName : {
        type: String,
        require : true,
        unique: true,
    },
    email:{
        type: String,
        require : true,
        unique: true
    },
    password : {
        type: String,
        require : true,
    },
    phone : {
        type: String,
        require : false,
    },
    roleId : {
        type: Schema.ObjectId,
        ref : 'Role',
    },
    verification_token : {
        type: String,
        require: false,
    },
    expiredAt : {
        type: Date,
        require: false,
    },
    refresh_token : {
        type: String,
        require: false,
    },
    issuedIp : {
        type: String,
        require: false,
    }
},{timestamps : true});



const User = model('User' , userSchema)

export default User