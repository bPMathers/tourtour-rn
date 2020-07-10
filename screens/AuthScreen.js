import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, TextInput, Text, Button, AsyncStorage, Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import jwt from 'jwt-decode'
import i18n from 'i18n-js'
import Animation from '../components/Animation';

import { TourTourColors } from '../constants/Colors'
import CustomButton from '../components/CustomButton'

const AuthScreen = (props) => {

  // const { data: tokenData, client: unusedClient } = useQuery(GET_TOKEN_AND_USER_ID);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)

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

  const CREATE_USER = gql`
    mutation($name: String!, $email: String!, $password: String!) {
      createUser(
        data: {
          name: $name
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

  const [createUser, { data: createUserData }] = useMutation(CREATE_USER)

  let token = data?.loginUser?.token

  useEffect(() => {

    if (token) {
      const decodedJwt = jwt(token, { complete: true });
      client.writeData({
        data: {
          token: token,
          userId: decodedJwt.userId
        }
      })

      const setItem = async () => {
        await AsyncStorage.setItem('userToken', JSON.stringify(token))
      }
      setItem()
    }
  }, [token])

  let signUpToken = createUserData?.createUser?.token

  useEffect(() => {

    if (signUpToken) {
      const decodedJwt = jwt(signUpToken, { complete: true });
      client.writeData({
        data: {
          token: signUpToken,
          userId: decodedJwt.userId
        }
      })

      const setItem = async () => {
        await AsyncStorage.setItem('userToken', JSON.stringify(signUpToken))
      }
      setItem()
    }
  }, [signUpToken])

  /**
   * HELPERS
   */

  const handleLoginSubmit = () => {
    login({
      variables: {
        email: email,
        password: pw
      },
    }).catch(res => {
      console.log(`Error: ${res}`)
    })
  }

  const handleConfirmSignUp = () => {
    createUser({
      variables: {
        name: name,
        email: email,
        password: pw
      }
    }).catch(res => {
      console.log(`Error: ${res}`)
    })
    setIsSigningUp(false)
  }

  const handleSignUp = () => {
    setIsSigningUp(true)
  }

  let ErrorContainer = () => {
    return <View></View>
  }

  if (error && !isSigningUp) {
    ErrorContainer = () => {
      return (
        <View>
          {error.graphQLErrors.map(({ message }, i) => (
            <Text style={styles.errorMsgs} key={i}>{i18n.t(message)}</Text>
          ))}
        </View>

      )
    }
  }



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'position'} keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 50}>
        <View style={styles.animationContainer}>
          <Animation width={150} height={150} />
        </View>
        {isSigningUp &&
          <View>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.formInput}
              // keyboardType='email-address'
              onChangeText={name => setName(name)}
              value={name}
              // autoCapitalize='none'
              clearButtonMode='while-editing'
            />
          </View>}
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
        <Text style={styles.label}>{i18n.t('Password')}</Text>
        <TextInput
          style={styles.formInput}
          secureTextEntry={true}
          onChangeText={pw => setPw(pw)}
          value={pw}
        />
        <ErrorContainer />
        {!isSigningUp &&
          <View>
            <CustomButton title={i18n.t('Login')} onPress={handleLoginSubmit} color={TourTourColors.primary} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white' }}>{i18n.t('Or')}</Text></View>
            <CustomButton title={i18n.t('SignUp')} onPress={handleSignUp} color={TourTourColors.primary} />
          </View>}
        {isSigningUp &&
          <View>
            <View style={{ marginVertical: 10 }}>
              <CustomButton
                title={i18n.t('Submit')}
                onPress={handleConfirmSignUp}
                color={TourTourColors.positive}

              />
            </View>
            <View>
              <CustomButton title={i18n.t('Cancel')} onPress={() => setIsSigningUp(false)} color={TourTourColors.cancel} />
            </View>
          </View>}
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
  animationContainer: {
    backgroundColor: TourTourColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 20,
    marginBottom: 3,
  },
  formInput: {
    minWidth: '80%',
    borderRadius: 8,
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