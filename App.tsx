import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen  from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { Provider as PaperProvider} from 'react-native-paper';
import React, {useCallback} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "./firebaseConfig";
import RepertoireScreen from "./screens/RepertoireScreen";
import CinemaHallScreen from "./screens/SeatsReservationScreen";
import TicketReservationScreen from "./screens/TicketReservationScreen";
import BookingScreen from "./screens/BookingScreen";
import { Provider } from 'react-redux'
import store from "./store";
import TicketScreen from "./screens/TicketScreen";
import MovieDetailsScreen from "./screens/MovieDetailsScreen";
import {appTheme, navTheme} from "./theme";
import ProfileScreen from "./screens/ProfileScreen";
import SeatsReservationScreen from "./screens/SeatsReservationScreen";

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
        <Drawer.Navigator initialRouteName="Repertoire" >
            { user === null ?
                <>
                    <Drawer.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            title: 'Sign in',
                            headerStyle: {
                                backgroundColor: 'rgb(26, 28, 30)',
                            }
                        }}
                    />
                    <Drawer.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{
                            title: 'Sign up',
                            headerStyle: {
                                backgroundColor: 'rgb(26, 28, 30)',
                            }
                        }}
                    />
                </> :
                <>
                    <Stack.Screen
                        name="Home"
                        component={ProfileScreen}
                        options={{
                            title: 'Profile',
                            headerStyle: {
                                backgroundColor: 'rgb(26, 28, 30)',
                            }
                        }}
                    />
                </>}
            <Stack.Screen
                name="Repertoire"
                component={RepertoireScreen}
                options={{
                    title: 'Repertoire',
                    headerStyle: {
                        backgroundColor: 'rgb(26, 28, 30)',
                    }
                }}
            />
            <Stack.Screen
                name="Tickets"
                component={TicketScreen}
                options={{
                    title: 'Tickets',
                    headerStyle: {
                        backgroundColor: 'rgb(26, 28, 30)',
                    }
                }}
            />
        </Drawer.Navigator>
    );
}

export default function App() {

    return (
        <Provider store={store}>
            <PaperProvider theme={appTheme}>
                <NavigationContainer theme={navTheme}>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Root"
                            component={Root}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SeatsReservation"
                            component={SeatsReservationScreen}
                            options={{
                                title: 'Seats Reservation',
                                headerStyle: {
                                    backgroundColor: 'rgb(26, 28, 30)',
                                }
                            }}
                        />
                        <Stack.Screen
                            name="TicketReservation"
                            component={TicketReservationScreen}
                            options={{
                                title: 'Ticket Reservation',
                                headerStyle: {
                                    backgroundColor: 'rgb(26, 28, 30)',
                                }
                            }}
                        />
                        <Stack.Screen
                            name="Booking"
                            component={BookingScreen}
                            options={{
                                title: 'Booking',
                                headerStyle: {
                                    backgroundColor: 'rgb(26, 28, 30)',
                                }
                            }}
                        />
                        <Stack.Screen
                            name="MovieDetails"
                            component={MovieDetailsScreen}
                            options={{
                                title: 'Movie details',
                                headerStyle: {
                                    backgroundColor: 'rgb(26, 28, 30)',
                                }
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </Provider>
  );
}
