export function generateCoordinates5x5(
  lat: number,
  lng: number,
  rowCount = 5,
  colCount = 5,
  distance = 0.75,
): {
  latitude: number;
  longitude: number;
  quadrant: number;
  x: number;
  y: number;
}[] {
  const EARTH_RADIUS = 6371; // 지구의 반지름 (km);

  const dLat = (distance / EARTH_RADIUS) * (180 / Math.PI); // 위도 차이
  const dLng =
    (distance / (EARTH_RADIUS * Math.cos((Math.PI * lat) / 180))) *
    (180 / Math.PI); // 경도 차이

  const coordinates = [];

  for (let i = -Math.floor(rowCount / 2); i <= Math.floor(rowCount / 2); i++) {
    for (
      let j = -Math.floor(colCount / 2);
      j <= Math.floor(colCount / 2);
      j++
    ) {
      const newLat = lat + i * dLat;
      const newLng = lng + j * dLng;

      // 사분면 계산
      let quadrant;
      if (i > 0 && j > 0) {
        quadrant = '1';
      } else if (i > 0 && j < 0) {
        quadrant = '2';
      } else if (i < 0 && j < 0) {
        quadrant = '3';
      } else if (i < 0 && j > 0) {
        quadrant = '4';
      } else {
        quadrant = '0'; // 중앙
      }

      coordinates.push({
        latitude: newLat,
        longitude:
          newLng > 180 ? newLng - 360 : newLng < -180 ? newLng + 360 : newLng,

        quadrant: quadrant,
        x: j === 0 ? '0' : j.toString(),
        y: i === 0 ? '0' : i.toString(),
      });
    }
  }

  return coordinates;
}
