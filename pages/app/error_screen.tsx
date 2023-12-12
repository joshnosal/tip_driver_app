import { Text, View } from 'react-native-ui-lib';
import { ScreenProps } from '../../resources/ScreenHOC';


export default function ErrorScreen(props: ScreenProps){
  let message: string = ''

  switch(props.route.params?.message) {
    case 'Unown server error. Please try back later': {
      message = props.route.params?.message
      break
    }
    default: message ='Application error'
  }

  return(
    <View>
      <Text>{props.route.params?.message}</Text>
    </View>
  )
}