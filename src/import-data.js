const shapefile = require("shapefile");
import Parser from "node-dbf";
import mongoose from "mongoose";
import Road from "./model/road";
import Landuse from "./model/landuse";

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
mongoose.connect("mongodb://localhost:27017/roads", dbOptions, (err) => {
  const roads = [];
  shapefile
    .open(filePathToRoadShp, filePathToRoadDbf, { encoding: "UTF-8" })
    .then((source) =>
      source.read().then(function log(result) {
        if (result.done) return;
        roads.push(result.value);
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
          await Road.insertMany(toInsert);
          toInsert = [];
        }
      }
      const landuses = [];
      shapefile
        .open(filePathToLanduseShp, filePathToLanduseDbf, { encoding: "UTF-8" })
        .then((source) =>
          source.read().then(function log(result) {
            if (result.done) return;
            landuses.push(result.value);
            return source.read().then(log);
          })
        )
        .catch((error) => console.error(error.stack))
        .finally(async () => {
          console.log(landuses.length);
          let toInsert = [];
          for (let i = 0; i < landuses.length; i++) {
            toInsert.push(landuses[i]);
            const isLastItem = i === landuses.length - 1;
            // every 100 items, insert into the database
            if (i % 100 === 0 || isLastItem) {
              await Landuse.insertMany(toInsert);
              toInsert = [];
            }
          }
          mongoose.connection.close();
        });
    });
});
