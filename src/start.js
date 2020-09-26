import Way from './model/way'
import { getPoints } from './utility/getPoints'
import mongoose from 'mongoose'
import getPhotosFromGoogle from './utility/getPhotosFromGoogle'
import { saveFileToDb } from './utility/storePhotos'

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
                promises.push(getPhotosFromGoogle(`${points.oneDirection[k].lat},${points.oneDirection[k].lng}`, points.oneDirection[k].bearing, "oneDirection", k))
            }
            for (let k = 0; k < points.secondDirection.length; k++) {
                promises.push(getPhotosFromGoogle(`${points.oneDirection[k].lat},${points.oneDirection[k].lng}`, points.oneDirection[k].bearing, "secondDirection", k))
            }
            const finished = await Promise.all(promises)
            promises = []
            for (let k = 0; k < finished.length; k++) {
                const shortcut = finished[k]
                const file = await saveFileToDb(shortcut.fileName)
                points[shortcut.arrayName][shortcut.index].fileId = file._id
            }
            const update = await Way.update({
                _id: ways[i]._id
            }, {
                points
            }, { multi: true })
            console.log(update)
        }
        console.log(count)
    })

}

getPhotos()