export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Converts from radians to degrees.
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

export function bearing(startLat, startLng, destLat, destLng) {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}

export function getPointBasedOnMove(lat, lon, distanceInMeters, bearing) {
  const earthRadiusInMetres = 6371000;

  bearing = toRadians(bearing)
  lat = toRadians(lat)
  lon = toRadians(lon)

  const distFrac = distanceInMeters / earthRadiusInMetres;

  const latitudeResult = Math.asin(Math.sin(lat) * Math.cos(distFrac) + Math.cos(lat) * Math.sin(distFrac) * Math.cos(bearing));
  const a = Math.atan2(Math.sin(bearing) * Math.sin(distFrac) * Math.cos(lat), Math.cos(distFrac) - Math.sin(lat) * Math.sin(latitudeResult));
  const longitudeResult = (lon + a + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

  return {
    lat: toDegrees(latitudeResult),
    lng: toDegrees(longitudeResult)
  }
}
