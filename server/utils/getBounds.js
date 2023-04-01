
const degs2Rads = deg => (deg * Math.PI) / 180.0;

const rads2Degs = rad => rad * 180 / Math.PI;

function getBounds(lat, lng, distance = 1) {
    const earthRadius = 6371
    const response = {}
    const cardinalCoords = {
        north: 0,
        south: 180,
        east: 90,
        west: 270
    }

    const rLat = degs2Rads(lat);
    const rLng = degs2Rads(lng);
    const rAngDist = distance / earthRadius;
    for (const [name, angle] of Object.entries(cardinalCoords)) {

        const rAngle = degs2Rads(angle);
        const rLatB = Math.asin(Math.sin(rLat) * Math.cos(rAngDist) + Math.cos(rLat) * Math.sin(rAngDist) * Math.cos(rAngle));
        const rLonB = rLng + Math.atan2(Math.sin(rAngle) * Math.sin(rAngDist) * Math.cos(rLat), Math.cos(rAngDist) - Math.sin(rLat) * Math.sin(rLatB));

        response[name] = {
            'lat': rads2Degs(rLatB),
            'lng': rads2Degs(rLonB)
        };
    }
    return {
        'min_lat': response['south']['lat'],
        'max_lat': response['north']['lat'],
        'min_lng': response['west']['lng'],
        'max_lng': response['east']['lng']
    }
}
module.exports = getBounds