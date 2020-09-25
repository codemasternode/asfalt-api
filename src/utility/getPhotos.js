import Way from '../model/way'
import { getPoints } from './getPoints'
import mongoose from 'mongoose'
import getPhotosFromGoogle from './getPhotosFromGoogle'

const points = [
    {
        "id": "1967678596",
        "lat": 50.0188834,
        "lon": 19.8731100,
        "version": 1,
        "timestamp": 1350344556000,
        "changeset": 0,
        "uid": "0",
        "user": ""
    },
    {
        "id": "497375769",
        "lat": 50.0189729,
        "lon": 19.8723854,
        "version": 1,
        "timestamp": 1253053491000,
        "changeset": 0,
        "uid": "0",
        "user": ""
    },
    {
        "id": "295825454",
        "lat": 50.0187711,
        "lon": 19.8751083,
        "version": 5,
        "timestamp": 1489607110000,
        "changeset": 0,
        "uid": "0",
        "user": ""
    }
]

const getPhotos = () => {
    mongoose.connect("mongodb://localhost:27017/roads", { useUnifiedTopology: true, useNewUrlParser: true }, async (err) => {
        const ways = await Way.aggregate([
            {
                $match: {
                    "tags.name": {
                        $eq: "Mieczysława Wrony"
                    }
                }
            }
        ])
        let count = 0
        for (let i = 0; i < ways.length; i++) {
            const points = getPoints(ways[i].nodeRefs)
            const promises = []
            count += points.oneDirection.length + points.secondDirection.length
            for (let k = 0; k < points.oneDirection.length; k++) {
                promises.push(getPhotosFromGoogle())
            }
            for (let k = 0; k < points.secondDirection.length; k++) {

            }
        }
        console.log(count)
    })

}

getPhotos()