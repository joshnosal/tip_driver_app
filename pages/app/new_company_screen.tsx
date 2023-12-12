import { Text, View, TextField, Button, Colors } from 'react-native-ui-lib';
import React from 'react';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native'
import { AppContext } from '../../resources/AppContext';
import api from '../../resources/API';
import { CompanyProps } from '../../resources/types';
import { KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ScreenProps } from '../../resources/ScreenHOC';


export default function NewCompanyScreen(props: ScreenProps){
  const [ name, setName ] = React.useState('')
  const [ loading, setLoading ] = React.useState(false)
  const [ error, setError ] = React.useState('')
  const { Authorization, setCompanyId } = React.useContext(AppContext)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    if(isFocused) setName('')
  }, [isFocused])

  const createCompany = async () => {
    try {
      if(!name) return setError('Required')
      setLoading(true)
      let device = await api.post<Partial<CompanyProps>, CompanyProps>({
        url: process.env.EXPO_PUBLIC_API+'/company/new',
        body: {
          name,
          admins: [],
          basic_users: []
        },
        headers: { Authorization }
      })
      await setCompanyId(device._id)
      props.navigation.navigate('Summary')
    } catch(e) {
      setError('Failed to create company')
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
            <Text text40L marginB-10>New Company</Text>
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
              onPress={createCompany}
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