import mongoose from "mongoose";

const AuthenticationSchema = new mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
})

const Authentication = mongoose.model('Authentication', AuthenticationSchema); 

export default Authentication;
