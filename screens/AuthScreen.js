import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, TextInput, Text, Button, AsyncStorage } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';



const GET_TOKEN = gql`
{
  token @client 
}
`;


const AuthScreen = (props) => {
  /**
   * HOOKS
   */


  const { data: tokenData, client: unusedClient } = useQuery(GET_TOKEN);

  /**
   * GRAPHQL
   */

  const LOGIN = gql`
  mutation($email: String!, $password: String!) {
  loginUser(
    data: {
      email: $email
      password: $password
    }) {
    user {
      id
      name
    }
    token
    }
  }
`;

  const [login, { data, client }] = useMutation(LOGIN)
  let token = data?.loginUser?.token ?? "NoClientTokenValueYet"
  // let token = tokenData.token

  useEffect(() => {
    client.writeData({
      data: {
        token: token
      }
    })

    if (token !== "NoClientTokenValueYet") {
      client.writeData({
        data: {
          token: token
        }
      })

      const setItem = async () => {
        await AsyncStorage.setItem('userToken', JSON.stringify(token))
      }
      setItem()
      props.navigation.navigate('HomeSearch')
    }
  }, [token])

  /**
   * HELPERS
   */

  const handleLoginSubmit = () => {
    login({
      variables: {
        // eventually get from FormInput
        email: 'gros@jambon2.com',
        password: 'red12345'
      },
      // refetchQueries: [{ query: GET_TOKEN }]
    })

  }


  return (
    <View style={styles.container}>
      <Text>This is the Auth Screen</Text>
      <View>
        <Text>email</Text>
        <TextInput />
      </View>
      <View>
        <Text>password</Text>
        <TextInput />
      </View>
      <Button title="login" onPress={handleLoginSubmit} color='blue' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default AuthScreen;