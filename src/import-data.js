const shapefile = require("shapefile");
import Parser from "node-dbf";
import mongoose from "mongoose";
import Road from "./model/road";
import Landuse from "./model/landuse";
import Point from "./model/points";

const filePathToRoadShp = "./data/Poland/malapolskie/road.shp";
const filePathToRoadDbf = "./data/Poland/malapolskie/road.dbf";
const filePathToLanduseShp = "./data/Poland/malapolskie/landuse.shp";
const filePathToLanduseDbf = "./data/Poland/malapolskie/landuse.dbf";

const dbOptions = {
  poolSize: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
mongoose.promise = global.promise;
const points = [];
mongoose.connect("mongodb://localhost:27017/roads", dbOptions, (err) => {
  const roads = [];
  shapefile
    .open(filePathToRoadShp, filePathToRoadDbf, { encoding: "UTF-8" })
    .then((source) =>
      source.read().then(function log(result) {
        if (result.done) return;
        roads.push(result.value);
        for (let i = 0; i < result.value.geometry.coordinates.length; i++) {
          points.push({
            osmId: result.value.properties.osm_id,
            lat: result.value.geometry.coordinates[i][1],
            lng: result.value.geometry.coordinates[i][0],
            name: result.value.properties.name,
            fclass: result.value.properties.fclass
          });
        }

        return source.read().then(log);
      })
    )
    .catch((error) => console.error(error.stack))
    .finally(async () => {
      console.log(roads.length);
      let toInsert = [];
      for (let i = 0; i < roads.length; i++) {
        toInsert.push(roads[i]);
        const isLastItem = i === roads.length - 1;
        // every 100 items, insert into the database
        if (i % 100 === 0 || isLastItem) {
          await Road.create(toInsert);
          toInsert = [];
        }
      }
      toInsert = [];
      for (let i = 0; i < points.length; i++) {
        toInsert.push(points[i]);
        const isLastItem = i === points.length - 1;
        // every 100 items, insert into the database
        if (i % 100 === 0 || isLastItem) {
          await Point.create(toInsert);
          toInsert = [];
        }
      }

      mongoose.connection.close();
    });
});
