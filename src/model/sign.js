import mongoose from 'mongoose'

const SignSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
})

export default mongoose.model(SignSchema)