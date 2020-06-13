import { googleApiKey } from '../env'

export const getReverseGeocodingInfo = async (location) => {
  if (location.lat) {

    try {
      const revGeoCodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${googleApiKey}`)

      if (!revGeoCodingResponse.ok) {
        throw new Error("error while fetching reverse geocoding")
      }

      const resData = await revGeoCodingResponse.json()
      const formattedAddress = resData.results[0].formatted_address
      const googlePlaceId = resData.results[0].place_id
      return {
        formattedAddress,
        googlePlaceId
      }
    } catch {
      throw new Error('Error during reverse geocoding request')
    }
  } else {
    return undefined
  }
}