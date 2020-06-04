import { gql } from 'apollo-boost'

const GET_CAT_PLACES = gql`
query($catId: String) {
  places(query: $catId) {
    id
    name
    imageUrl
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

export {
  GET_CAT_PLACES
}