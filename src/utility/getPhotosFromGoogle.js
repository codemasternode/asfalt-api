import axios from 'axios'
import "dotenv/config"

const getPhotosFromGoogle = async (location, heading) => {
    const data = await axios({
        url: `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${location}&heading=${heading}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    })
}

export default getPhotosFromGoogle