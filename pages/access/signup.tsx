import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo'

export default function SignUpForm({changeView, styles}: {
  changeView: (v:'signin'|'signup'|void) => void,
  styles: StyleSheet.NamedStyles<any>
}){
  const { isLoaded, signUp, setActive } = useSignUp()
  const [ emailAddress, setEmailAddress ] = useState<string>('josh.nosal.test@gmail.com')
  const [ password, setPassword ] = useState<string>('bobbert19!')
  const [ confirm, setConfirm ] = useState<string>('bobbert19!')
  const [ error, setError ] = useState<string|void>()
  const [ pendingVerification, setPendingVerfication ] = useState<boolean>(false)
  const [ code, setCode ] = useState<string>('')

  const onSignUpPress = async () => {
    if(!isLoaded) return

    if(!emailAddress) {
      return setError('Please enter your email')
    } else if (!password) {
      return setError('Please enter a password')
    } else if (!confirm) {
      return setError('Please confirm your password')
    } else if (confirm !== password) {
      return setError("Password isn't the same")
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerfication(true)
    } catch(e) {
      if(e.errors.length) {
        setError(e.errors[0].message)
      }
      console.log(JSON.stringify(e, null, 2))
    }
  }

  const onVerificationPress = async () => {
    if(!isLoaded) return

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      await setActive({ session: completeSignUp.createdSessionId })
    } catch(e) {
      console.log(e)
    }
  }


  return (
    <View style={styles.modal}>
      {!pendingVerification ? (
        <>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            placeholder='Email...'
            style={styles.input}
            value={emailAddress}
            onChangeText={t => setEmailAddress(t)}
          />
          <TextInput
            placeholder='Password...'
            style={styles.input}
            value={password}
            onChangeText={t => setPassword(t)}
            secureTextEntry={true}
          />
          <TextInput
            placeholder='Confirm...'
            style={styles.input}
            value={confirm}
            onChangeText={t => setConfirm(t)}
            secureTextEntry={true}
          />
          {error && (
            <Text style={styles.errorMsg}>{error}</Text>
          )}
          <TouchableHighlight
            underlayColor='#386890'
            onPress={onSignUpPress}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnTxt}>Register</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#6a9bc3'
            onPress={() => changeView('signin')}
            style={styles.otherBtn}
          >
            <Text style={styles.otherBtnTxt}>Sign In</Text>
          </TouchableHighlight>
        </>
      ) : (
        <>
          <Text style={styles.title}>Email Confirmation</Text>
          <TextInput
            placeholder='Confirmation Code...'
            style={styles.input}
            value={code}
            onChangeText={t => setCode(t)}
          />
          <TouchableHighlight
            underlayColor='#386890'
            onPress={onVerificationPress}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnTxt}>Confirm</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#6a9bc3'
            onPress={() => changeView('signin')}
            style={styles.otherBtn}
          >
            <Text style={styles.otherBtnTxt}>Sign In</Text>
          </TouchableHighlight>
        </>
      )}
    </View>
  )
}