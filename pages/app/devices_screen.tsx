import { Button, Colors, Picker, PickerValue, Text, View } from 'react-native-ui-lib';
import React from 'react';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native'
import { AppContext } from '../../resources/AppContext';
import LoadingDisplay from '../../resources/Loading';
import api from '../../resources/API';
import { ScreenProps } from '../../resources/ScreenHOC';
import { DeviceProps } from '../../resources/types';


export default function DevicesScreen(props: ScreenProps){
  const [ loading, setLoading ] = React.useState(true)
  const [ devices, setDevices ] = React.useState<DeviceProps[]>([])
  const [ value, setValue ] = React.useState<string>('')
  const { Authorization, companyId, setDeviceId, deviceId } = React.useContext(AppContext)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    if(!isFocused) return
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        let data = await api.get<DeviceProps[]>({
          url: process.env.EXPO_PUBLIC_API + '/device/devices',
          headers: { Authorization, companyId }
        })
        
        setDevices(data)
        setLoading(false)
      } catch(e) {
        if(controller.signal.aborted) return console.log('Aborted')
        console.log(e)
      }
    }
    
    fetchData()
    return () => controller.abort()
  }, [isFocused, companyId])

  React.useEffect(() => {
    setValue(deviceId || '')
  }, [deviceId])

  const select = async () => {
    try {
      await setDeviceId(value)
      props.navigation.navigate('Summary')
    } catch(e) {
      console.log(e)
    }
  }

  return loading ? (
    <LoadingDisplay/>
  ) : (
    <View flex center>
      <View width={200} gap-20>
        <Text text40L color={Colors.grey40}>Devices</Text>
        <Picker
          placeholder='Search...'
          value={value}
          mode={Picker.modes.SINGLE}
          onChange={v => setValue(v ? v.toString() : '')}
          enableModalBlur={false}
          useSafeArea
          topBarProps={{ title: 'Devices' }}
          showSearch
          searchPlaceholder='Search devices'
          containerStyle={{
            width: 200,
            borderBottomWidth: 1,
            rowGap: 5
          }}
          text30L
          marginB-20
        >
          {devices.map(item => (
            <Picker.Item key={item._id} label={item.name} value={item._id}/>
          ))}
        </Picker>
        <Button
          label='Select'
          onPress={select}
          disabled={!value || value === deviceId}
          text50M
          backgroundColor={Colors.$backgroundGeneralHeavy}
        />
        <Button
          label='New'
          onPress={() => props.navigation.navigate('New Device')}
          text50M
          backgroundColor={Colors.transparent}
          color={Colors.$backgroundGeneralHeavy}
          outlineColor={Colors.$backgroundGeneralHeavy}
        />

      </View>
    </View>
  )
}