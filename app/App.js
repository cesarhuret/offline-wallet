import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { HomeScreen, Wallet } from './pages/Wallet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Animated } from "react-native";


const av = new Animated.Value(0);
av.addListener(() => {return});
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255, 255, 255)',
    card: 'rgb(0, 0, 0)',
    text: '#fff',
    border: 'rgb(0, 0, 0)',
    notification: 'rgb(255, 69, 58)',
  },
};

function App() {

  const Tab = createMaterialTopTabNavigator();

  return (
    <NavigationContainer
      theme={MyTheme}
    >
      <Tab.Navigator
        tabBarPosition={"bottom"}
        // tabBar={(props) => <BottomTabBar {...props} />}
        // screenOptions={{
        //   tabBarStyle: { borderWidth: 1, borderRadius: 20, },
        // }}
        screenListeners={{
          focus: () => {
            Animated.timing(av, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      >
      <Tab.Screen name="Scan" component={Wallet} />
      {/* <Tab.Screen name="Chats" component={ChatMenu} /> */}
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Create Payment" component={Wallet} />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;