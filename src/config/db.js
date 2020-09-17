import mongoose from "mongoose";

export default URI => {
    const dbOptions = {
        poolSize: 4,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    };
    mongoose.promise = global.promise
    mongoose.connect(URI, dbOptions, async err => {
        if (err) {
            throw new Error(err)
        }
        console.log("Connected")
    });

};