import mongoose, { Schema } from "mongoose";

const LanduseSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model("landuse", LanduseSchema);
