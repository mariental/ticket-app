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
import RepertoireScreen from "./screens/RepertoireScreen";
import CinemaHallScreen from "./screens/CinemaHall";
import ReservationScreen from "./screens/ReservationScreen";
import OrderScreen from "./screens/OrderScreen";

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
            <Stack.Screen name="Repertoire" component={RepertoireScreen} />
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
                    <Stack.Screen name="CinemaHall" component={CinemaHallScreen} />
                    <Stack.Screen name="Reservation" component={ReservationScreen} />
                    <Stack.Screen name="Order" component={OrderScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
  );
}
