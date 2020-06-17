
export const orderByDistance = (placesArray, refLocation) => {
  // Calclulate each array element's distance from refLocation
  const refLat = refLocation.lat
  const refLng = refLocation.lng

  // create a new array where all elements have a new distance key
  placesArray.map((place) => {
    place.distance = Math.hypot(Math.abs(place.lat - refLat), Math.abs(place.lng - refLng))
  })

  // Order ASC by distance value
  placesArray.sort(function (a, b) {
    return a.distance - b.distance;
  });

  return placesArray

}