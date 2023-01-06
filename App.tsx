import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen  from './screens/HomeScreen';
import LoginScreen  from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MoviesScreen from './screens/MoviesScreen';
import MovieDetailsScreen from "./screens/MovieDetailsScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { Provider as PaperProvider } from 'react-native-paper';
import React from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "./firebaseConfig";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {

    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })
    }, []);

    return (
        <Drawer.Navigator initialRouteName="Home">
            { user === null ?
                <>
                    <Drawer.Screen name="Login" component={LoginScreen} />
                    <Drawer.Screen name="Register" component={RegisterScreen} />
                </> :
                <></>}
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Movies" component={MoviesScreen} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <PaperProvider>
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
        </PaperProvider>
  );
}
