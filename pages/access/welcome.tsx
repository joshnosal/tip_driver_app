import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

export default function WelcomePage({changeView, styles}: {
  changeView: (v:'signin'|'signup'|void) => void,
  styles: StyleSheet.NamedStyles<any>
}){
  return (
    <>
    <View style={{
      padding: 10,
      width: '60%',
      minWidth: 260,
      gap: 20
    }}>
      <Text style={styles.title}>Welcome to Tip Driver!</Text>
      <TouchableHighlight
        underlayColor='#386890'
        onPress={() => changeView('signin')}
        style={styles.submitBtn}
      >
        <Text style={styles.submitBtnTxt}>Sign In</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor='#6a9bc3'
        onPress={() => changeView('signup')}
        style={styles.otherBtn}
      >
        <Text style={styles.otherBtnTxt}>Sign Up</Text>
      </TouchableHighlight>
    </View>
    </>
  )
}