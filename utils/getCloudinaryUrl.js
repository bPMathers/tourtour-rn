export const getCloudinaryUrl = async (imageBase64) => {
  if (imageBase64) {
    try {
      // get cloudinary Url
      const base64ImgToUpload = `data:image/jpg;base64,${imageBase64}`

      const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
      const data = {
        "file": base64ImgToUpload,
        "upload_preset": "TourTour1",
      }
      const cloudinaryUrl = await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async result => {
        const data = await result.json()
        return data.secure_url

      })
      return cloudinaryUrl
    } catch {
      throw new Error('Problem uplading image to cloud')
    }
  } else {
    return undefined
  }
}