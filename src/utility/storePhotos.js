import { bearing, toDegrees, toRadians } from "./bearing";
import { Client } from "@googlemaps/google-maps-services-js";
import "dotenv/config";
import axios from "axios";
import fs from "fs";
import path from "path";

//longitude, latitude
const points = [
  [20.4132983, 49.4264564],
  [20.4143716, 49.4272136],
  [20.4153793, 49.4277218],
  [20.4157706, 49.4277918],
  [20.4158422, 49.4278046],
  [20.4163634, 49.4278978],
];

const downloadArray = [];

for (let i = 0; i < points.length; i++) {
  downloadArray.push(
    fileDownload(
      { lat: points[i][1], lng: points[i][0] },
      `./data/Poland/malapolskie/photos/point${i}.jpeg`
    )
  );
}

Promise.all(downloadArray).then(() => {
  console.log("Udało się !!!");
});

function fileDownload({ lat, lng }, location) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(location);
    axios({
      url: `https://maps.googleapis.com/maps/api/streetview?key=${process.env.GOOGLE_MAPS_API_KEY}&size=1200x900&location=${lat},${lng}&heading=300`,
      responseType: "stream",
    })
      .then((response) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject();
        });
        writer.on("close", () => {
          if (!error) {
            console.log("Udało się !!!!");
            resolve(true);
          }
          //no need to call the reject here, as it will have been called in the
          //'error' stream;
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  });
}
