import express from "express";
import Way from '../model/way'
import dbConnect from '../config/db'
import "dotenv/config"

const app = express();
dbConnect("mongodb://localhost:27017/roads")

app.get("/", (req, res) => {
  Way.aggregate([
    {
      $match: {
        "tags.name": {
          $eq: "Skotnicka"
        }
      }
    }
  ]).then((data) => {
    let markersScript = ""
    for (let i = 0; i < data.length; i++) {
      for(let k = 0; k < data[i].nodeRefs.length; k++) {
        markersScript += `
        var infowindow${i}${k} = new google.maps.InfoWindow({
          content: "<span>${data[i]._id}</span><br><span>${data[i].nodeRefs[k].lat}</span><br><span>${data[i].nodeRefs[k].lon}</span>"
        });
        var marker${i}${k} = new google.maps.Marker({position: {lat: ${data[i].nodeRefs[k].lat}, lng: ${data[i].nodeRefs[k].lon}}, map: map, title: '${data[i]._id}'});
        google.maps.event.addListener(marker${i}${k}, 'click', function() {
          infowindow${i}${k}.open(map,marker${i}${k});
        });
        `
      }
     
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
