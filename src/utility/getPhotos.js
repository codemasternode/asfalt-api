import Way from '../model/way'
import { getPoints } from './getPoints'
import mongoose from 'mongoose'

const getPhotos = () => {
    mongoose.connect("mongodb://localhost:27017/roads", { useUnifiedTopology: true }, async (err) => {
        const ways = await Way.aggregate([
            {
                $match: {
                    "tags.name": {
                        $eq: "Mieczysława Wrony"
                    }
                }
            }
        ])
        for (let i = 0; i < ways.length; i++) {
            const points = getPoints(ways[i].nodeRefs)
            console.log(points)
        }
    })

}

getPhotos()