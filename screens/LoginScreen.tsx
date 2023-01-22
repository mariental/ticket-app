import React from "react";
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useTheme } from 'react-native-paper';


export default function LoginScreen({ navigation }: any) {

    const theme = useTheme()

    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('');
    const [error, setError] = React.useState<string>('')

    const handleSubmit = async (): Promise<void> => {
        await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                onChangeEmail('');
                onChangePassword('');
                navigation.navigate('Repertoire');
            })
            .catch(error => {
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    setError('That email address is invalid!');
                }
                if (error.code === '@error auth/wrong-password' ) {
                    console.log('Wrong credentials!');
                    setError('Wrong credentials!');
                }
                console.error(error);
                setError(error.message);
            });
    }

    return (
        <SafeAreaView style={[styles.container ,{ backgroundColor: theme.colors.background}]}>
            <View style={{backgroundColor: theme.colors.secondaryContainer, padding: 40, borderRadius: 30, marginTop: 40}}>
                <Text style={{textAlign: "center", color: theme.colors.onSecondaryContainer}} variant="headlineSmall">Login to your account</Text>
                <TextInput
                    style={styles.input}
                    label="Email"
                    mode="outlined"
                    onChangeText={onChangeEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    label="Password"
                    mode="outlined"
                    secureTextEntry={true}
                    onChangeText={onChangePassword}
                    value={password}
                />
                <Button
                    style={{marginTop: 20}}
                    mode="elevated"
                    onPress={handleSubmit}>
                    Log in
                </Button>
                {error !== '' ? <Text>{error !== ""}</Text>: null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        marginTop: 10
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 80,
        marginBottom: 10
    }
});


