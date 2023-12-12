import { Text, TextField, View, Button, Colors } from 'react-native-ui-lib';
import React from 'react'
import { KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import api from '../../resources/API';
import { AppContext } from '../../resources/AppContext';
import { DeviceProps } from '../../resources/types';
import * as Network from 'expo-network';
import * as Application from 'expo-application'
import { useIsFocused } from '@react-navigation/native'
import { ScreenProps } from '../../resources/ScreenHOC';



export default function NewDeviceScreen(props: ScreenProps){
  const [ name, setName ] = React.useState('')
  const [ loading, setLoading ] = React.useState(false)
  const [ error, setError ] = React.useState('')
  const { companyId, Authorization, setDeviceId } = React.useContext(AppContext)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    if(isFocused) setName('')
  }, [isFocused])

  const createDevice = async () => {
    try {
      if(!name) return setError('Required')
      setLoading(true)
      let device = await api.post<Partial<DeviceProps>, DeviceProps>({
        url: process.env.EXPO_PUBLIC_API+'/device/new',
        body: {
          name,
          device_id: await Application.getIosIdForVendorAsync() || undefined,
          ip_address: await Network.getIpAddressAsync()
        },
        headers: { companyId, Authorization }
      })
      await setDeviceId(device._id)
      props.navigation.navigate('Summary')
    } catch(e) {
      setError('Failed to create device')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View flex center >
          <View>
            <Text text40L marginB-10>New Device</Text>
            <TextField
              placeholder='Name'
              floatingPlaceholder
              text30L
              style={{
                width: 200,
                borderBottomWidth: 1,
                rowGap: 5,
                paddingBottom: 5
              }}
              value={name}
              onChangeText={v => setName(v)}
              enableErrors={Boolean(error)}
              validationMessage={error}
              marginB-20
            />
            <Button
              label='Create'
              onPress={createDevice}
              text60BO
              backgroundColor={Colors.$backgroundGeneralHeavy}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}