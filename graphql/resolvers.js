import { gql } from 'apollo-boost'


// 'extend' adds new mutations to the ones Apollo is already aware of coming from the backend
export const typeDefs = gql`
  extend type Mutation {
    newPlaceLat: Float! 
    newPlaceLng: Float! 
  }
`

const GET_NEW_PLACE_LAT = gql`
{ 
  id
  newPlaceLat @client
}
`

export const resolvers = {
  Mutation: {
    newPlaceLat: (_parent, _args, { cache }, _info) => {
      const { newPLaceLat } = cache.readQuery({
        query: GET_NEW_PLACE_LAT
        // add variables here if needed
      })

      cache.writeQuery({
        query: GET_NEW_PLACE_LAT,
        data: "temporarily hardcoded latitude to test cache flow"
      })
      return newPLaceLat
    }

  }
}