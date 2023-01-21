import React from "react";
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, TextInput, Text, useTheme} from 'react-native-paper';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { ref, set } from "firebase/database";

export default function RegisterScreen({ navigation }: any) {

    const theme = useTheme()

    const [login, onChangeLogin] = React.useState<string>('');
    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');

    const handleSubmit = async (): Promise<void> => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                onChangeEmail('');
                onChangePassword('');
                navigation.navigate('Repertoire');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    setError('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    setError('That email address is invalid!');
                }
                console.error(error);
                setError(error.message);
            })
    }

    return (
        <SafeAreaView  style={[styles.container ,{ backgroundColor: theme.colors.background}]}>
            <View style={{backgroundColor: theme.colors.secondaryContainer, padding: 40, borderRadius: 30, marginTop: 40}}>
                <Text style={{textAlign: "center", color: theme.colors.onSecondaryContainer}} variant="headlineSmall">Register new account</Text>
                <TextInput
                    style={styles.input}
                    label="Login"
                    mode="outlined"
                    onChangeText={onChangeLogin}
                    value={login}
                />
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
                    Register
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
    }
});


