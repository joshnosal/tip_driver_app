import { Button, Colors, Picker, PickerValue, Text, View } from 'react-native-ui-lib';
import React from 'react';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native'
import { AppContext } from '../../resources/AppContext';
import LoadingDisplay from '../../resources/Loading';
import api from '../../resources/API';
import { CompanyProps } from '../../resources/types';
import { ScreenProps } from '../../resources/ScreenHOC';


export default function CompaniesScreen(props: ScreenProps){
  const [ loading, setLoading ] = React.useState(true)
  const [ companies, setCompanies ] = React.useState<CompanyProps[]>([])
  const [ value, setValue ] = React.useState<string>('')
  const { Authorization, companyId, setCompanyId, setDeviceId } = React.useContext(AppContext)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    if(!isFocused) return
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        let data = await api.get<CompanyProps[]>({
          url: process.env.EXPO_PUBLIC_API+'/user/companies',
          headers: { Authorization }
        })
        setCompanies(data)
        setLoading(false)
      } catch(e) {
        if(controller.signal.aborted) return console.log('Aborted')
        console.log(e)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [isFocused])

  React.useEffect(() => {
    setValue(companyId || '')
  }, [companyId])

  const select = async () => {
    try {
      await setDeviceId()
      await setCompanyId(value)
      
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
      <Text text40L color={Colors.grey40}>Company</Text>
        <Picker
          placeholder='Search...'
          value={value}
          mode={Picker.modes.SINGLE}
          onChange={v => setValue(v ? v.toString() : '')}
          enableModalBlur={false}
          useSafeArea
          topBarProps={{ title: 'Companies' }}
          showSearch
          searchPlaceholder='Search companies'
          containerStyle={{
            width: 200,
            borderBottomWidth: 1,
            rowGap: 5
          }}
          text30L
          marginB-20
        >
          {companies.map(item => (
            <Picker.Item key={item._id} label={item.name} value={item._id}/>
          ))}
        </Picker>
        <Button
          label='Select'
          onPress={select}
          disabled={!value || value === companyId}
          text50M
          backgroundColor={Colors.$backgroundGeneralHeavy}
        />
        <Button
          label='New'
          onPress={() => props.navigation.navigate('New Company')}
          text50M
          backgroundColor={Colors.transparent}
          color={Colors.$backgroundGeneralHeavy}
          outlineColor={Colors.$backgroundGeneralHeavy}
        />
      </View>
    </View>
  )
}