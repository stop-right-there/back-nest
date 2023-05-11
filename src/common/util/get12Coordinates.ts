const earthRadius = 6371; // 지구 반지름 (km)

function convertDegreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function convertRadiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}
function findNewCoordinates(
  latitude: number,
  longitude: number,
  bearing: number,
  distance: number,
) {
  const distanceInRadians = distance / earthRadius;
  const bearingInRadians = convertDegreesToRadians(bearing);
  const lat1 = convertDegreesToRadians(latitude);
  const lon1 = convertDegreesToRadians(longitude);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceInRadians) +
      Math.cos(lat1) * Math.sin(distanceInRadians) * Math.cos(bearingInRadians),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingInRadians) * Math.sin(distanceInRadians) * Math.cos(lat1),
      Math.cos(distanceInRadians) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    latitude: convertRadiansToDegrees(lat2),
    longitude:
      convertRadiansToDegrees(lon2) > 180
        ? convertRadiansToDegrees(lon2) - 360
        : convertRadiansToDegrees(lon2) < -180
        ? convertRadiansToDegrees(lon2) + 360
        : convertRadiansToDegrees(lon2),
    bearing,
    distance,
  };
}

//
export function get12Coordinates(
  latitude: number,
  longitude: number,
  distance = 1000,
) {
  const coordinates = [
    findNewCoordinates(latitude, longitude, 0, distance), // 위
    findNewCoordinates(latitude, longitude, 30, distance), // 오른쪽 위
    findNewCoordinates(latitude, longitude, 60, distance), // 오른쪽
    findNewCoordinates(latitude, longitude, 90, distance), // 오른쪽 아래
    findNewCoordinates(latitude, longitude, 120, distance), // 아래
    findNewCoordinates(latitude, longitude, 150, distance), // 왼쪽 아래
    findNewCoordinates(latitude, longitude, 180, distance), // 왼쪽
    findNewCoordinates(latitude, longitude, 210, distance), // 왼쪽 위
    findNewCoordinates(latitude, longitude, 240, distance), // 왼쪽 위
    findNewCoordinates(latitude, longitude, 270, distance), // 왼쪽 위
    findNewCoordinates(latitude, longitude, 300, distance), // 왼쪽 위
    findNewCoordinates(latitude, longitude, 330, distance), // 왼쪽 위
  ];

  return coordinates;
}
