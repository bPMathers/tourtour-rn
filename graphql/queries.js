import { gql } from 'apollo-boost'

const GET_CAT_PLACES = gql`
query($catId: String) {
  places(query: $catId) {
    id
    name
    imageUrl
    formatted_address
    google_place_id
    addedBy {
      id
      name
    }
    review_count
    category {
      id
    }
    photos{
      id
    }
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

const GET_CACHED_IMG_URI = gql`
{
  imageUrl @client
}
`;

export {
  GET_CAT_PLACES,
  GET_ADD_PLACE_DATA,
  GET_CACHED_IMG_URI
}