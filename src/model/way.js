import mongoose, { Schema } from "mongoose";

const WaySchema = new mongoose.Schema(
    {},
    { strict: false }
);


export default mongoose.model("ways", WaySchema);