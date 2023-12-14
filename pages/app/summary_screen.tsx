import { Text, TextField, View, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';
import React from 'react';
import { AppContext } from '../../resources/AppContext';
import LoadingDisplay from '../../resources/Loading';
import { CompanyProps, DeviceProps } from '../../resources/types';
import { Feather } from '@expo/vector-icons';
import { ScreenProps } from '../../resources/ScreenHOC';
import * as Linking from 'expo-linking';
import api from '../../resources/API';


export default function SummaryScreen(props: ScreenProps){
  const [ loading, setLoading ] = React.useState(true)
  const { Authorization, companyId, validation } = React.useContext(AppContext)
  const [ company, setCompany ] = React.useState<CompanyProps|void>()
  const [ device, setDevice ] = React.useState<DeviceProps|void>()


  React.useEffect(() => {
    if(!validation) return
    setCompany(validation.company)
    setDevice(validation.device)
  }, [validation])

  return !validation ? (
    <LoadingDisplay/>
  ) : (
    <View flex center gap-10>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Companies')}
      >
        <View gap-5 padding-10 width={250} left>
          <Text text60L grey40>Company</Text>
          {company ? (
            <Text text50R>{company.name}</Text>
          ) : (
            <Text text50L red20>None Selected</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Devices')}
      >
        <View gap-5 padding-10 width={250} left>
          <Text text60L grey40>Device</Text>
          {device ? (
            <>
              <Text text50R>{device.name}</Text>
              <Text text60R>{device.ip_address}</Text>
            </>
          ) : (
            <Text text50L red20>None Selected</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          try {
            
            // let url = await api.get
          } catch(e) {

          }
          validation && validation.stripeUpdateLink ? Linking.openURL(validation.stripeUpdateLink) : null
        }}
      >
        <View gap-5 padding-10 width={250} left>
          <Text text60L grey40>Payments</Text>
          {validation.paymentsEnabled ? (
            <Text text50R>Enabled</Text>
          ) : (
            <Text text50L red20>Disabled</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if(validation.company) {
            Linking.openURL(process.env.EXPO_PUBLIC_WEB + '/dash/company/'+validation.company._id + '/settings')
          }
        }}
      >
        <View gap-5 padding-10 width={250} left>
          <Text text60L grey40>Subscription</Text>
          {validation.accountActive ? (
            <Text text50R>Enabled</Text>
          ) : (
            <Text text50L red20>None</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}