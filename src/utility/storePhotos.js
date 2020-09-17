import { bearing, toDegrees, toRadians } from "./bearing";
import { Client } from "@googlemaps/google-maps-services-js";
import "dotenv/config";
import axios from "axios";
import fs from "fs";
import path from "path";

//longitude, latitude
const points = [
  [19.9245235, 50.059255],
  [19.9242931, 50.0592544],
  [19.9241684, 50.0592645],
  [19.9239091, 50.059296],
];

var f = fs.createWriteStream("test.jpeg");

const writer = fs.createWriteStream("./test.jpeg");
axios({
  url: `https://maps.googleapis.com/maps/api/streetview?key=${process.env.GOOGLE_MAPS_API_KEY}&size=1200x900&location=47.5763831,-122.4211769&heading=80`,
  responseType: "stream",
})
  .then((response) => {
    response.data.pipe(writer);
    let error = null;
    writer.on("error", (err) => {
      error = err;
      writer.close();
    });
    writer.on("close", () => {
      if (!error) {
        console.log("Udało się !!!!");
      }
      //no need to call the reject here, as it will have been called in the
      //'error' stream;
    });
  })
  .catch((err) => {
    console.log(err.response.data);
  });
