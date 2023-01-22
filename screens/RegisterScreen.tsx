import React from "react";
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, TextInput, Text, useTheme, Snackbar} from 'react-native-paper';
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth, db } from "../firebaseConfig";

export default function RegisterScreen({ navigation }: any) {

    const theme = useTheme()

    const [login, onChangeLogin] = React.useState<string>('');
    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [visible, setVisible] = React.useState(false)

    const onToggleSnackBar = () => setVisible(!visible)
    const onDismissSnackBar = () => setVisible(false)

    const handleSubmit = async (): Promise<void> => {
        if( email.length === 0 &&  password.length === 0){
            setError('You must provide credentials!')
            onToggleSnackBar()
        }
        else{
            await createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    onChangeEmail('');
                    onChangePassword('');
                    if(auth.currentUser !== null){
                        updateProfile(auth.currentUser, {
                            displayName: login
                        }).then(() => {
                            navigation.navigate('Repertoire');
                        }).catch((error) => {
                            console.log(error)
                        });
                    }
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        setError('That email address is already in use!');
                    }
                    else if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        setError('That email address is invalid!');
                    }
                    onToggleSnackBar()
                })
        }

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
            </View>
            <View style={{flex: 1}}>
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    wrapperStyle={{}}
                    style={{backgroundColor: theme.colors.errorContainer}}
                    duration={1000}>
                    {error}
                </Snackbar>
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


