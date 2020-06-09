import { gql } from 'apollo-boost'

const GET_CATEGORIES = gql`
  query {
    categories {
      id
      title
      imageUrl
      addedBy{
        id
        name
      }
    }
  }
`;



const GET_PLACE = gql`
  query($placeId: String) {
    place(query: $placeId) {
      id
      name
      url
      phone
      review_count
      imageUrl
      category {
        id
      }
      lat
      lng
      formatted_address
      google_place_id
      addedBy {
        id
        name
      }
      avgRating
    }
  }
`

// Need to paginate
const GET_CAT_PLACES = gql`
  query($catId: String) {
    places(query: $catId) {
      id
      name
      url
      phone
      review_count
      imageUrl
      category {
        id
      }
      lat
      lng
      formatted_address
      google_place_id
      addedBy {
        id
        name
      }
      avgRating
      createdAt
      updatedAt
    }
  }
`;

const GET_ADD_PLACE_DATA = gql`
{
  lat @client 
  lng @client
  imageUrl @client
  imageBase64 @client

}
`;

const GET_REVIEWS = gql`
  query($placeId: String) {
    reviews(query: $placeId) {
      id
      title
      body
      rating
      author {
        id
        name
        imageUrl
      }
      place {
        id
        name
        formatted_address
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_CACHED_IMG_URI = gql`
{
  imageUrl @client
}
`;

const GET_TOKEN = gql`
{
  token @client
}
`;

const GET_SEARCH_LOCATION = gql`
{
  searchLocLat @client
  searchLocLng @client
  searchLocCity @client
}
`;

const GET_MY_CACHED_LOCATION = gql`
{
      myLat @client
      myLng @client
}
`;

export {
  GET_CAT_PLACES,
  GET_ADD_PLACE_DATA,
  GET_CACHED_IMG_URI,
  GET_SEARCH_LOCATION,
  GET_MY_CACHED_LOCATION,
  GET_CATEGORIES,
  GET_PLACE,
  GET_REVIEWS,
  GET_TOKEN

}