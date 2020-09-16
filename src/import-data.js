const shapefile = require("shapefile")
import Parser from 'node-dbf';
import mongoose from 'mongoose'
import Road from './model/road'

const filePathToRoadsShp = "./data/Poland/malapolskie/road.shp"
const filePathToRoadsDbf = "./data/Poland/malapolskie/road.dbf"

const dbOptions = {
    poolSize: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};
mongoose.promise = global.promise
mongoose.connect("mongodb://localhost:27017/roads", dbOptions, (err) => {
    const roads = []
    shapefile.open(filePathToRoadsShp, filePathToRoadsDbf, { encoding: "UTF-8" })
        .then(source => source.read()
            .then(function log(result) {
                if (result.done) return;
                roads.push(result.value)
                return source.read().then(log);
            }))
        .catch(error => console.error(error.stack)).finally(async () => {
            console.log(roads.length)
            let toInsert = []
            for (let i = 0; i < roads.length; i++) {
                toInsert.push(roads[i]);
                const isLastItem = i === roads.length - 1;
                // every 100 items, insert into the database
                if (i % 100 === 0 || isLastItem) {
                    await Road.insertMany(toInsert);
                    toInsert = [];
                }
            }
            mongoose.connection.close()
        })
})




// let parser = new Parser("./data/Poland/malapolskie/road.dbf");
// const records = []
// parser.on('start', (p) => {
//     console.log('dBase file parsing has started');
// });

// parser.on('header', (h) => {
//     console.log('dBase file header has been parsed');
// });

// parser.on('record', (record) => {
//     records.push({ ...record })
// });

// parser.on('end', (p) => {
//     console.log('Finished parsing the dBase file');
// });

// parser.parse();