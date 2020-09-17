import { bearing } from "./bearing";
import { Client } from "@googlemaps/google-maps-services-js";
import "dotenv/config";
import axios from "axios";
import fs from "fs";
import path from "path";

//longitude, latitude
const points = [
  [19.8020216, 50.0856686],
  [19.8025729, 50.085785],
  [19.8030318, 50.0859327],
  [19.8033258, 50.0860198],
  [19.8035147, 50.0860689],
  [19.8037026, 50.0861009],
  [19.8039351, 50.0861341],
  [19.8041411, 50.086152],
];

const downloadArray = [];

for (let i = 0; i < points.length - 1; i++) {
  downloadArray.push(
    fileDownload(
      { lat: points[i][1], lng: points[i][0] },
      `./data/Poland/malapolskie/photos/point${i}.jpeg`,
      bearing(points[i][1], points[i][0], points[i + 1][1], points[i + 1][0])
    )
  );
}

Promise.all(downloadArray).then(() => {
  console.log("Udało się !!!");
});

function fileDownload({ lat, lng }, location, heading) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(location);
    axios({
      url: `https://maps.googleapis.com/maps/api/streetview?key=${process.env.GOOGLE_MAPS_API_KEY}&size=1200x900&location=${lat},${lng}&heading=${heading}`,
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
