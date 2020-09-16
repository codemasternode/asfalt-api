import mongoose, { Schema } from "mongoose";

const RoadSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        properties: {
            osm_id: {
                type: String
            },
            code: {
                type: String,
                required: true
            },
            fclass: {
                type: String,
                required: true
            },
            name: {
                type: String
            }
        },
        geometry: {
            type: {
                type: String,
                required: true
            },
            coordinates: {
                type: Array
            }
        }
    },
    { strict: false }
);


export default mongoose.model("roads", RoadSchema);