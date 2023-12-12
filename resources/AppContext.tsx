import React, { createContext, useReducer, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';
import * as Application from 'expo-application';
import { useAuth } from '@clerk/clerk-expo';
import api from './API';
import { TabParamList } from '../pages/app';
import { CompanyProps, DeviceProps } from './types';
import { Platform } from 'react-native';
import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native';

type ValidationProps = {
  validCompany: boolean,
  companyCount: number,
  validDevice: boolean,
  deviceCount: number,
  errorMessage: string,
  company?: CompanyProps,
  device?: DeviceProps,
  accountActive: boolean,
  paymentsEnabled: boolean,
  stripeUpdateLink?: string
}

interface InitialStateProps {
  companyId: string|null
  deviceId: string|null
  Authorization: string|null
  validation?: ValidationProps
}

interface AppContextProps extends InitialStateProps {
  setCompanyId: (c?: string|null) => void,
  setDeviceId: (d?: string|null) => void,
  setAuthorization: (s: string) => void
  setValidated: (v: boolean) => void
  validateApp: () => void
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps)

const reducer = (s: InitialStateProps, a: object) => ({...s, ...a})

export default function AppContextProvider(props: {
  children: React.ReactNode
}){
  const { getToken } = useAuth()
  const controller = new AbortController()
  const [ state, dispatch ] = useReducer(reducer, {
    companyId: null,
    deviceId: null,
    Authorization: null,
  })

  const setAuthorization = (token: string) => dispatch({ Authorization: `Bearer ${token}`})
  const setValidated = (validated: boolean) => dispatch({ validated })
  const setCompanyId = async (companyId?: string | null) => {
    dispatch({ companyId })
    companyId ? await SecureStore.setItemAsync('companyId', companyId) : await SecureStore.deleteItemAsync('companyId')
  }
  const setDeviceId = async (deviceId?: string|null) => {
    dispatch({ deviceId })
    deviceId ? await SecureStore.setItemAsync('deviceId', deviceId) : await SecureStore.deleteItemAsync('deviceId')
  }
  const validateApp = async () => {
    try {
      // Get local store
      const companyId = await SecureStore.getItemAsync('companyId')
      const deviceId = await SecureStore.getItemAsync('deviceId')
      const uniqueId = Platform.OS === 'android' ? Application.androidId : await Application.getIosIdForVendorAsync()
      const ipAddress = await Network.getIpAddressAsync()

      // Get token
      let token = await getToken()
      let Authorization = `Bearer ${token}`
      dispatch({ Authorization })
      let validation = await api.get<ValidationProps>({
        url: process.env.EXPO_PUBLIC_API + '/app/validate',
        headers: {
          Authorization,
          companyId,
          deviceId,
          uniqueId,
          ipAddress
        },
        signal: controller.signal
      })
      dispatch({ validation, companyId, deviceId })
  
      console.log('Finished validation')
      return
    } catch(e) {
      console.log(e)
      if(controller.signal.aborted) console.log('Abort validation')
    }
  }

  React.useEffect(() => {
    validateApp()
    return () => controller.abort()
  }, [state.companyId, state.deviceId])

  const appContext = useMemo<AppContextProps>(() => ({
    ...state,
    setAuthorization,
    setCompanyId,
    setDeviceId,
    setValidated,
    validateApp
  }), [state])

  const fetchTokenProvider = async (): Promise<string> => {
    let token = await api.get<string>({
      url: process.env.EXPO_PUBLIC_API + '/terminal/connection_token',
      headers: { Authorization: `Bearer ${await getToken()}` }
    })
    return token
  }

  return (
    <StripeTerminalProvider
      tokenProvider={fetchTokenProvider}
      logLevel='verbose'
    >
      <AppContext.Provider value={appContext}>
          {props.children}
      </AppContext.Provider>
      </StripeTerminalProvider>
  )
}