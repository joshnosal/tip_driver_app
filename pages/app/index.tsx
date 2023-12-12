
import React, { ComponentType } from 'react'
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps, BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import AppContextProvider, { AppContext } from '../../resources/AppContext';
import SummaryScreen from './summary_screen';
import { useAuth } from '@clerk/clerk-expo';
import withValidation from '../../resources/ScreenHOC';
import NewCompanyScreen from './new_company_screen';
import NewDeviceScreen from './new_device_screen';
import CompaniesScreen from './companies_screen';
import DevicesScreen from './devices_screen';
import { TouchableOpacity } from 'react-native'
import { View, Text, Button, Colors } from 'react-native-ui-lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import TipScreen from './tip_screen';
import ErrorScreen from './error_screen';

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  }
}


export type TabParamList = {
  'Tip': undefined
  'Summary': undefined
  'New Company': undefined
  'New Device': undefined
  'Companies': undefined
  'Devices': undefined
  'Error': {message: string} | undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export default function AppScreen(){
  return (
    <AppContextProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator 
          initialRouteName='Tip'
          screenOptions={{
            header: params => <Header  {...params} />
          }}
          tabBar={TabBar}
        >
          <Tab.Screen name='Summary' component={SummaryScreen}/>
          <Tab.Screen name='Tip' component={withValidation(TipScreen)} options={{ headerShown: false }}/>
          <Tab.Screen name='New Company' component={NewCompanyScreen}/>
          <Tab.Screen name='New Device' component={withValidation(NewDeviceScreen)}/>
          <Tab.Screen name='Companies' component={CompaniesScreen}/>
          <Tab.Screen name='Devices' component={withValidation(DevicesScreen)}/>
          <Tab.Screen name='Error' component={ErrorScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  )

}


const Header = (props: BottomTabHeaderProps) => {
  return (
    <View row padding-10 centerV>
      <View left centerV flexG>
        {['Companies', 'New Company', 'Devices', 'New Device'].includes(props.route.name) && (
          <Button
            label='Back'
            size='small'
            link
            text60R
            color='gray'
            iconSource={() => <Entypo name='chevron-left' size={20} color='gray'/>}
            onPress={() => props.navigation.navigate('Summary', {initial: true})}
          />
        )}
      </View>
    </View>
  )
}

function TabBar({ state, descriptors, navigation}: BottomTabBarProps){
  let tabArray: (keyof TabParamList)[] = ['Summary', 'Tip']
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = route.name

        if(label !== 'Summary' && label !== 'Tip') return null

        const isFocused = state.index === index

        const onPress = () => {
          if(!isFocused) {
            navigation.navigate(route.name)
          }
        }
        return (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={{ 
              flex: 1,
              alignItems: 'center',
            }}
            key={index}
          >
            <View
              style={{
                width: 100,
                height: 50,
                borderRadius: 25,
                ...(isFocused && { backgroundColor: Colors.$backgroundGeneralHeavy })
              }}
              center
            >
              <MaterialIcons
                size={24}
                name={route.name === 'Summary' ? 'device-unknown' : 'payment'}
                color={isFocused ? Colors.white : undefined}
              />
              <Text style={{
                ...(isFocused && {color: Colors.white})
              }} text70M>{label === 'Summary' ? 'Settings' : label}</Text>

            </View>
          </TouchableOpacity>
        )
      })}
      <SignOutButton/>
    </View>
  )
}

const SignOutButton = () => {
  const { signOut } = useAuth()

  return (
    <TouchableOpacity
      accessibilityRole='button'
      onPress={() => signOut()}
      style={{ 
        flex: 1,
        alignItems: 'center'
      }}
    >
      <Ionicons name='log-out-outline' size={24}/>
      <Text text70M>Sign Out</Text>
    </TouchableOpacity>
  )
}




