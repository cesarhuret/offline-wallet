import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Wallet } from './pages/Wallet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Create } from './pages/Create';
import { Animated } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QRCodePage } from './components/QRCode';
import { Scan } from './pages/Scan';
import { Sign } from './components/Sign';
import { ScanPopup } from './pages/ScanPopup';
import { Execute } from './pages/Execute';

const av = new Animated.Value(0);
av.addListener(() => {return});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    card: '#fff',
    text: '#000',
    border: 'rgb(0, 0, 0)',
    notification: 'rgb(255, 69, 58)',
  },
};

const Stack = createNativeStackNavigator();

const Tabs = ({ route }) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      tabBarPosition={"bottom"}
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
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Create Payment" component={Create} />
    </Tab.Navigator>
  );
}

function App() {
  
  return (
    <NavigationContainer
      theme={MyTheme}
    >
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: true
        }}
      >
        <Stack.Screen name="Main" component={Tabs}/>
        <Stack.Screen name="QRCode" 
          component={QRCodePage}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: "slide_from_bottom",
          }} 
        />
        <Stack.Screen name="Sign" 
          component={Sign}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: "slide_from_bottom",
          }} 
        />
        <Stack.Screen name="ScanPopup" 
          component={ScanPopup}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: "slide_from_bottom",
          }} 
        />
        <Stack.Screen name="Execute" 
          component={Execute}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: "slide_from_bottom",
          }} 
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
}



export default App;