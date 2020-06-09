import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, TextInput, Text, Button, AsyncStorage } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { TourTourColors } from '../constants/Colors'

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
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

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

  const [login, { data, client, error }] = useMutation(LOGIN)
  // console.log(error.graphQLErrors)
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
        email: email,
        password: pw
      },
      // refetchQueries: [{ query: GET_TOKEN }]
    }).catch(res => {
      console.log(`Error: ${res}`)
    })

  }

  let ErrorContainer = () => {
    return <View></View>
  }

  if (error) {
    // console.log(error.graphQLErrors)
    ErrorContainer = () => {
      return (
        <View>
          {error.graphQLErrors.map(({ message }, i) => (
            <Text style={styles.errorMsgs} key={i}>{message}</Text>
          ))}
        </View>

      )
    }
  }



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={50}>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.formInput}
            keyboardType='email-address'
            onChangeText={email => setEmail(email)}
            value={email}
            autoCapitalize='none'
            clearButtonMode='while-editing'
          />
        </View>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.formInput}
          secureTextEntry={true}
          onChangeText={pw => setPw(pw)}
          value={pw}
        />
        <ErrorContainer />
        <Button title="Connexion" onPress={handleLoginSubmit} color='white' />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TourTourColors.accent,
  },
  formInput: {
    minWidth: '80%',
    borderWidth: 2,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    fontSize: 20,
    color: '#555'
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  errorMsgs: {
    color: TourTourColors.cancel,
    fontWeight: 'bold',
    marginBottom: 10
  }
})

export default AuthScreen;