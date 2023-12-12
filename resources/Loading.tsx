import { View, Text, Animated, Easing } from 'react-native'
import { useRef, useEffect } from 'react'

export default function LoadingDisplay(){
  const degValue = useRef(new Animated.Value(0)).current

  
  useEffect(() => {
    const animation = Animated.timing(degValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true
    })
    Animated.loop(animation).start()
    
  }, [])


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{
        transform: [{ rotate: degValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })}]
      }}>
        <View style={{ flexDirection: 'row'}}>
          <Dot/>
          <Dot/>
        </View>
        <View style={{ flexDirection: 'row'}}>
          <Dot/>
          <Dot/>
        </View>
      </Animated.View>
    </View>
  )
}

const Dot = () => (
  <View style={{
    padding: 10,
    borderRadius: 10,
    margin: 10,
    backgroundColor: 'steelblue'
  }}/>
)