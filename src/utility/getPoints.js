import { bearing } from './bearing'
import { distanceInKmBetweenEarthCoordinates } from './distanceBetweenTwoPoints'
import { getPointBasedOnMove } from './bearing'



const getPoints = (points, reversed, arrayWithPointsInOneDirection) => {
    if (reversed) {
        points.reverse()
    }

    const pointsWithDistances = []
    let fullLengthOfPartial = 0
    for (let i = 0; i < points.length; i++) {
        pointsWithDistances.push({
            lat: points[i].lat,
            lng: points[i].lon,
            distanceFromLastPoint: i === 0 ? 0 : distanceInKmBetweenEarthCoordinates(points[i].lat, points[i].lon, points[i - 1].lat, points[i - 1].lon),
            bearing: i === points.length - 1 ? pointsWithDistances[i - 1].bearing : bearing(points[i].lat, points[i].lon, points[i + 1].lat, points[i + 1].lon)
        })
        fullLengthOfPartial += pointsWithDistances[i].distanceFromLastPoint
    }

    let count = 1
    while (pointsWithDistances[count] && count < pointsWithDistances.length) {
        if (pointsWithDistances[count].distanceFromLastPoint > 0.05) {
            pointsWithDistances.splice(count, 0, {
                ...getPointBasedOnMove(pointsWithDistances[count].lat, pointsWithDistances[count].lng, 100, pointsWithDistances[count].bearing),
                distanceFromLastPoint: 0.05,
                bearing: pointsWithDistances[count].bearing
            })
            pointsWithDistances[count + 1].distanceFromLastPoint -= 0.05
            if (pointsWithDistances[count + 1].distanceFromLastPoint <= 0.05) {
                count += 2
            } else {
                count++
            }
        } else {
            count++
        }
    }
    if (reversed) {
        return { oneDirection: arrayWithPointsInOneDirection, secondDirection: pointsWithDistances }
    }
    return getPoints(points, true, pointsWithDistances)
}

export { getPoints }
