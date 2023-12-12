import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useState } from 'react';
import { useSignIn, useAuth } from '@clerk/clerk-expo'

export default function ResetPWForm({changeView, styles}: {
  changeView: (v:'signin'|'signup'|void) => void,
  styles: StyleSheet.NamedStyles<any>
}){
  const { isLoaded, setActive, signIn } = useSignIn()
  const { signOut } = useAuth()

  const [ stage, setStage ] = useState<number>(0)
  const [ emailAddress, setEmailAddress ] = useState<string>('josh.nosal.test@gmail.com')
  const [ password, setPassword ] = useState<string>('bobbert19!')
  const [ confirm, setConfirm ] = useState<string>('bobbert19!')
  const [ code, setCode ] = useState<string>('')
  const [ error, setError ] = useState<string|void>()

  const requestCode = async () => {
    if(!isLoaded) return

    if(!emailAddress) return setError('Please enter your email')

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress
      })
      setError()
      setStage(stage + 1)
    } catch(e) {
      if(e.errors.length) {
        setError(e.errors[0].message)
      }
      console.log(JSON.stringify(e, null, 2))
    }
  }

  const submitReset = async () => {
    if(!isLoaded) return

    if(!code) {
      return setError('Please enter your verification code')
    } else if(!password) {
      return setError('Please enter a new password')
    } else if (!confirm) {
      return setError('Please confirm your new password')
    } else if (confirm !== password) {
      return setError("Password isn't the same")
    }

    try {
      const res = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      })

      await signOut()
      setError()
      setStage(stage + 1)

    } catch(e) {
      if(e.errors.length) {
        setError(e.errors[0].message)
      }
      console.log(JSON.stringify(e, null, 2))
    }
  }
  
  return (
    <View style={styles.modal}>
      {stage === 0 ? (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            placeholder='Email...'
            style={styles.input}
            value={emailAddress}
            onChangeText={t => setEmailAddress(t)}
          />
          {error && (
            <Text style={styles.errorMsg}>{error}</Text>
          )}
          <TouchableHighlight
            underlayColor='#386890'
            onPress={requestCode}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnTxt}>Register</Text>
          </TouchableHighlight>
        </>
      ) : stage === 1 ? (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            placeholder='Verification Code...'
            style={styles.input}
            value={code}
            onChangeText={t => setCode(t)}
          />
          <TextInput
            placeholder='New Password...'
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
            onPress={submitReset}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnTxt}>Reset</Text>
          </TouchableHighlight>
        </>
      ) : (
        <>
          <Text style={styles.title}>Success!</Text>
          <Text style={{ fontSize: 20 }}>Your password has been reset. Please sign in.</Text>
          <TouchableHighlight
            underlayColor='#386890'
            onPress={() => changeView('signin')}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnTxt}>Continue</Text>
          </TouchableHighlight>
        </>
      )}
    </View>
  )
}