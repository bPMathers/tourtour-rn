import { gql } from 'apollo-boost'

const GET_USER = gql`
    query($userId: String) {
      user(query: $userId) {
        id
        name
        status
        imageUrl
        reviews {
            id
        }
        photos {
            id
        }
        places{
          id
        }
      }
    }
  `;

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
      reviews {
        id
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
  query($placeId: String, $searchQuery: String $orderBy: ReviewOrderByInput, $first: Int) {
    reviews(query: $placeId, searchQuery: $searchQuery orderBy: $orderBy, first: $first) {
      id
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
const GET_MY_REVIEWS = gql`
  query {
    myReviews {
      id
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
const GET_MY_PLACES = gql`
  query {
    myPlaces {
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

const GET_MY_PHOTOS = gql`
  query {
    myPhotos {
      id
      url
      addedBy {
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

const GET_USER_PHOTOS = gql`
  query($userId: ID!) {
    photos(userId: $userId) {
      id
      url
      addedBy {
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
const GET_TOKEN_AND_USER_ID = gql`
{
  token @client
  userId @client
}
`;

const GET_SEARCH_LOCATION = gql`
{
  searchLocLat @client
  searchLocLng @client
  searchLocCity @client
}
`;

const GET_MY_LOCATION = gql`
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
  GET_CATEGORIES,
  GET_PLACE,
  GET_REVIEWS,
  GET_TOKEN_AND_USER_ID,
  GET_TOKEN,
  GET_MY_LOCATION,
  GET_MY_REVIEWS,
  GET_MY_PHOTOS,
  GET_MY_PLACES,
  GET_USER,
  GET_USER_PHOTOS

}