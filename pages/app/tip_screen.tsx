import { Text, View, Button } from 'react-native-ui-lib';
import { 
  StripeTerminalProvider, 
  Reader,
  Location,
  useStripeTerminal,
  requestNeededAndroidPermissions
 } from '@stripe/stripe-terminal-react-native'
import React from 'react';
import api from '../../resources/API';
import { AppContext } from '../../resources/AppContext';
import { Alert, Platform } from 'react-native';
import { ScreenProps } from '../../resources/ScreenHOC';

export default function TipScreen(props: ScreenProps){
  const { initialize: initStripe } = useStripeTerminal()
  const [hasPerms, setHasPerms] = React.useState<boolean>(false);
  const simulated = process.env.NODE_ENV === 'development' ? true : false

  React.useEffect(() => {
    const initAndClear = async () => {
      const { error, reader } = await initStripe()

      if(error) return Alert.alert('StripeTerminal init failed', error.message)

      if(reader) {
        console.log(
          'StripeTerminal has been initialized properly and connected to the reader',
          reader
        )
        return
      }

      console.log('StripeTerminal has been initialized properly')
    }
    if(hasPerms) {
      initAndClear()
    }
  }, [initStripe, hasPerms])

  const handlePermissionsSuccess = React.useCallback(async () => {
    setHasPerms(true);
  }, []);

  React.useEffect(() => {
    const handlePermissions = async () => {
      try {
        const { error } = await requestNeededAndroidPermissions({
          accessFineLocation: {
            title: 'Location Permission',
            message: 'Stripe Terminal needs access to your location',
            buttonPositive: 'Accept',
          }
        })
        if(!error) {
          handlePermissionsSuccess()
        } else {
          console.error(
            'Location and BT services are required in order to connect to a reader.'
          );
        }
      } catch(e) {
        console.error('Location and BT services are required in order to connect to a reader.')
      }
    }
    if(Platform.OS === 'android') {
      handlePermissions()
    } else {
      handlePermissionsSuccess()
    }

  }, [handlePermissionsSuccess])


  return (
    <View flex center>
      <Text>Tip Screen new</Text>

      
    </View>
  )
}

const PaymentScreen = () => {
  

  

  return (
    <View>
      <Text>Payment Mode</Text>
      
    </View>
  )
}