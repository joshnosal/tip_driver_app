
import React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../pages/app';
import { AppContext } from './AppContext';
import LoadingDisplay from './Loading';
import { useIsFocused } from '@react-navigation/native'


export type ScreenProps = BottomTabScreenProps<TabParamList>

const withValidation = (Component: React.ComponentType<ScreenProps>) => (props: BottomTabScreenProps<TabParamList>) => {
  const isFocused = useIsFocused()
  const [ loading, setLoading ] = React.useState(true)
  const { validation} = React.useContext(AppContext)

  React.useEffect(() => {
    setLoading(true)
    if(!isFocused) return
    if(!validation) return
    if(props.route.name === 'Tip') {
      if(validation.validCompany) {
        if(!validation.validDevice) props.navigation.navigate(validation.deviceCount ? 'Devices' : 'New Device')
        else if (!validation.accountActive || !validation.paymentsEnabled) props.navigation.navigate('Summary')
      } else {
        props.navigation.navigate(validation.companyCount ? 'Companies' : 'New Company')
      }
    }
    setLoading(false)
  }, [validation, isFocused])
  
  return loading ? (
    <LoadingDisplay/>
  ) : (
    <Component {...props}/>
  )
}

export default withValidation