import {Button, StyleSheet, Text, View} from 'react-native';
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { auth } from "../firebaseConfig";
import ProfileScreen from "./ProfileScreen";

export default function HomeScreen({ navigation }: any) {

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


    if (!user) {
        return (
            <View>
                <Text>Login</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ProfileScreen/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    }
});

