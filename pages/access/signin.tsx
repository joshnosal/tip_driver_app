import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo'
import { useState } from 'react';

export default function SignInForm({changeView, styles}: {
  changeView: (v:'signin'|'signup'|'reset'|void) => void,
  styles: StyleSheet.NamedStyles<any>
}){
  const { isLoaded, setActive, signIn } = useSignIn()
  const [ emailAddress, setEmailAddress ] = useState<string>('josh.nosal.test@gmail.com')
  const [ password, setPassword ] = useState<string>('bobbert19!')
  const [ error, setError ] = useState<string|void>()

  const onSignInPress = async () => {
    if(!isLoaded) return

    if(!emailAddress) {
      return setError('Please enter your email')
    } else if(!password) {
      return setError('Please enter a password')
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password
      })
      await setActive({ session: completeSignIn.createdSessionId })
    } catch(e) {
      if(e.errors.length) {
        setError(e.errors[0].message)
      }
      console.log(JSON.stringify(e, null, 2))
    }
  }

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder='Email...'
        style={styles.input}
        value={emailAddress}
        onChangeText={t => setEmailAddress(t)}
      />
      <TextInput
        placeholder='Passowrd...'
        style={styles.input}
        value={password}
        onChangeText={t => setPassword(t)}
        secureTextEntry={true}
      />
      {error && (
        <Text style={styles.errorMsg}>{error}</Text>
      )}
      <TouchableHighlight
        underlayColor='#386890'
        onPress={onSignInPress}
        style={styles.submitBtn}
      >
        <Text style={styles.submitBtnTxt}>Enter</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor='#6a9bc3'
        onPress={() => changeView('signup')}
        style={styles.otherBtn}
      >
        <Text style={styles.otherBtnTxt}>Sign Up</Text>
      </TouchableHighlight>
      <View>
        <Button
          title='Forgot Password'
          color='#4682b4'
          onPress={() =>changeView('reset')}
        />
      </View>
    </View>
  )
}