export function generateCoordinates5x5(
  lat: number,
  lng: number,
  rowCount = 5,
  colCount = 5,
  distance = 750,
): {
  latitude: number;
  longitude: number;
  quadrant: number;
  x: number;
  y: number;
}[] {
  const EARTH_RADIUS = 6371; // Earth's radius (km)

  const dLat = (distance / EARTH_RADIUS) * (180 / Math.PI); // Latitude difference

  const coordinates = [];

  const startRow = -Math.floor(rowCount / 2);
  const endRow = Math.floor(rowCount / 2);
  const startCol = -Math.floor(colCount / 2);
  const endCol = Math.floor(colCount / 2);

  for (let i = startRow; i <= endRow; i++) {
    const newLat = lat + i * dLat;

    // Recalculate longitude difference for each latitude
    const dLng =
      (distance / (EARTH_RADIUS * Math.cos((Math.PI * newLat) / 180))) *
      (180 / Math.PI); // Longitude difference

    for (let j = startCol; j <= endCol; j++) {
      const newLng = lng + j * dLng;

      // Quadrant calculation
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
        quadrant = '0'; // Center
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
