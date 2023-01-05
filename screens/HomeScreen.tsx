import { Button, Text, View } from 'react-native';
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import auth from "../firebaseConfig";

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

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        signOut(auth)
            .then(() => {
                console.log('User signed out!');
                navigation.navigate('Login');
            })
            .catch(error => {
                console.log(error);
            })
    }

    if (!user) {
        return (
            <View>
                <Text>Login</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
            <Button
                title="logout"
                color="#f194ff"
                onPress={handleSubmit}
            />
        </View>
    );
}


