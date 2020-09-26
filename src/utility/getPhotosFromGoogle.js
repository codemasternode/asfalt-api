import axios from 'axios'
import "dotenv/config"
import { v4 } from 'uuid'
import fs from 'fs'

const getPhotosFromGoogle = (location, heading, arrayName, index) => {
    return new Promise((resolve, reject) => {
        const fileName = v4()
        const filePath = `./data/photos/${fileName}.jpeg`
        const writer = fs.createWriteStream(filePath);
        axios({
            url: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${location}&heading=${heading}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
            responseType: "stream"
        }).then(response => {
            response.data.pipe(writer);
            let error = null;
            writer.on("error", (err) => {
                error = err;
                writer.close();
                reject()
            });
            writer.on("close", () => {
                if (!error) {
                    console.log("Udało się !!!!");
                    resolve({ arrayName, index, fileName })
                }
            });
        }).catch(err => {
            console.log(err)
        })
    })

}

export default getPhotosFromGoogle