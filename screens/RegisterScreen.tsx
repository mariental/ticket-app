import { SafeAreaView, TextInput, StyleSheet, Text, Button, Alert } from 'react-native';
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { ref, set } from "firebase/database";

export default function RegisterScreen({ navigation }: any) {

    const [login, onChangeLogin] = React.useState<string>('');
    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('Home');
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Register new account</Text>
            <Text style={styles.label}>Login</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeLogin}
                value={login}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText={onChangePassword}
                value={password}
            />
            <Button
                title="submit"
                color="#f194ff"
                onPress={handleSubmit}
            />
            {error !== '' ? <Text style={styles.errorText}>{error !== ""}</Text>: null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        margin: 20
    },
    label: {
        marginLeft: 10,
        marginTop: 10
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    titleText: {
        textAlign: "center",
        fontSize: 30
    },
    errorText: {
        color: "red"
    }
});



