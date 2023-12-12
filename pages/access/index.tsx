import { Keyboard, KeyboardAvoidingView, StyleSheet, Platform, TouchableWithoutFeedback, View } from 'react-native';
import SignInForm from './signin';
import SignUpForm from './signup';
import WelcomePage from './welcome';
import { useState } from 'react';
import ResetPWForm from './resetpw';
import { SignedOut } from '@clerk/clerk-expo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '60%',
    minWidth: 260,
    borderRadius: 10,
    gap: 20
  },
  title: {
    fontSize: 30,
    fontWeight: '600'
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    
  },
  submitBtn: {
    backgroundColor: '#4682b4',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center'
  },
  submitBtnTxt: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20
  },
  otherBtn: {
    borderColor: '#4682b4',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center'
  },
  otherBtnTxt: {
    fontSize: 20
  },
  errorMsg: {
    color: 'red',
    fontSize: 20
  }
})

export default function AccessPage(){
  const [ view, setView ] = useState<'signin'|'signup'|'reset'|void>()

  return (
    <SignedOut>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1}}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {view === 'signup' ? (
              <SignUpForm
                changeView={setView}
                styles={styles}
              />
            ) : view === 'signin' ? (
              <SignInForm
                changeView={setView}
                styles={styles}
              />
            ) : view === 'reset' ? (
              <ResetPWForm
                changeView={setView}
                styles={styles}
              />
            ) : (
              <WelcomePage
                changeView={setView}
                styles={styles}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SignedOut>
  )
}