import mongoose from "mongoose";

const PointSchema = new mongoose.Schema(
  {
    osmId: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    fclass: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  { strict: true }
);

export default mongoose.model("points", PointSchema);
