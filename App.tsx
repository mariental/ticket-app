import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen  from './screens/HomeScreen';
import LoginScreen  from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MoviesScreen from './screens/MoviesScreen';
import MovieDetailsScreen from "./screens/MovieDetailsScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Register" component={RegisterScreen} />
            <Drawer.Screen name="Movies" component={MoviesScreen} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Root"
                component={Root}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Movies" component={MoviesScreen} />
            <Stack.Screen name="Details" component={MovieDetailsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
