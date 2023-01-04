import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import  HomeScreen  from './screens/HomeScreen';
import  LoginScreen  from './screens/LoginScreen';

export default function App() {

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Login" component={LoginScreen} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}
