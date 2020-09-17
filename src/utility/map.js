import express from "express";
import Point from '../model/points'
import dbConnect from '../config/db'
import "dotenv/config"

const app = express();
dbConnect("mongodb://localhost:27017/roads")

app.get("/", (req, res) => {
  Point.aggregate([
    {
      $match: {
        "fclass": {
          $eq: "primary"
        }
      }
    }
  ]).then((data) => {
    let markersScript = ""
    for (let i = 0; i < data.length; i++) {
      markersScript += `var marker${i} = new google.maps.Marker({position: {lat: ${data[i].lat}, lng: ${data[i].lng}}, map: map});`
    }
    res.set("Content-Type", "text/html");
    res.send(new Buffer(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Simple Map</title>
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
          <script
            src="https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=&v=weekly"
            defer
          ></script>
          <style type="text/css">
            #map {
              height: 100%;
            }
      
            /* Optional: Makes the sample page fill the window. */
            html,
            body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
          <script>
            "use strict";
      
            let map;
      
            function initMap() {
              map = new google.maps.Map(document.getElementById("map"), {
                center: {
                  lat: 50.166284,
                  lng: 19.7513785
                },
                zoom: 10
              });
              ${markersScript}
            }
            
          </script>
        </head>
        <body>
          <div id="map"></div>
        </body>
      </html>
    `));
  })

});

app.listen(3000, () => {
  console.log("App working on http://localhost:3000");
});
