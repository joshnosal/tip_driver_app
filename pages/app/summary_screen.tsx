import { Text, TextField, View, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';
import React from 'react';
import { AppContext } from '../../resources/AppContext';
import LoadingDisplay from '../../resources/Loading';
import { CompanyProps, DeviceProps } from '../../resources/types';
import { Feather } from '@expo/vector-icons';
import { ScreenProps } from '../../resources/ScreenHOC';
import * as Linking from 'expo-linking';


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
    <View gap-5 padding-10 width={250} left>
      <Button
        text40T
        color={Colors.grey30}
        link
        size='xSmall'
        label='Company'
        avoidInnerPadding
        iconOnRight
        iconSource={() => <Feather name='edit-2' color={Colors.grey50} style={{ marginLeft: 10 }} size={20}/>}
        onPress={() => props.navigation.navigate('Companies')}
      />
      {company ? (
        <Text text30L>{company.name}</Text>
      ) : (
        <Text text30L grey40 $textDisabled>None selected</Text>
      )}
      
    </View>
      
      <View gap-5 padding-10 width={250} left>
        <Button
          text40T
          color={Colors.grey30}
          link
          size='xSmall'
          label='Device'
          avoidInnerPadding
          iconOnRight
          iconSource={() => <Feather name='edit-2' color={Colors.grey50} style={{ marginLeft: 10 }} size={20}/>}
          onPress={() => props.navigation.navigate('Devices')}
        />
        {device ? (
          <>
            <Text text30L>{device.name}</Text>
            <Text text50L>{device.ip_address}</Text>
          </>
        ): (
          <Text text30L grey40 $textDisabled>None selected</Text>
        )}
      </View>
      <View gap-5 padding-10 width={250} left>
        <Button
          text40T
          color={Colors.grey30}
          link
          size='xSmall'
          label='Payments'
          avoidInnerPadding
          iconOnRight
          iconSource={() => <Feather name='edit-2' color={Colors.grey50} style={{ marginLeft: 10 }} size={20}/>}
          onPress={() => validation && validation.stripeUpdateLink ? Linking.openURL(validation.stripeUpdateLink) : null}
        />
        <Text text30L>{validation.paymentsEnabled ? 'Enabled' : 'Disabled'}</Text>
      </View>
      <View gap-5 padding-10 width={250} left>
        <Button
          text40T
          color={Colors.grey30}
          link
          size='xSmall'
          label='Subscription'
          avoidInnerPadding
          iconOnRight
          iconSource={() => <Feather name='edit-2' color={Colors.grey50} style={{ marginLeft: 10 }} size={20}/>}
          onPress={() => {
            if(validation.company) {
              Linking.openURL(process.env.EXPO_PUBLIC_API + '/dash/company/'+validation.company._id + '/settings')
            }
          }}
        />
        <Text text30L>{validation.accountActive ? 'Active' : 'Disabled'}</Text>
      </View>
    </View>
  )
}