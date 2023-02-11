import React from "react";
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, TextInput, Text, Snackbar} from 'react-native-paper';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useTheme } from 'react-native-paper';


export default function LoginScreen({ navigation }: any) {

    const theme = useTheme()

    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')
    const [visible, setVisible] = React.useState(false)


    const onToggleSnackBar = () => setVisible(!visible)
    const onDismissSnackBar = () => setVisible(false)


    const handleSubmit = async (): Promise<void> => {
        if( email.length === 0 &&  password.length === 0){
            setError('You must provide credentials!')
            onToggleSnackBar()
        }
        else{
            await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    onChangeEmail('');
                    onChangePassword('');
                    navigation.navigate('Repertoire');
                })
                .catch(error => {
                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!')
                        setError('That email address is invalid!')
                    }
                    else if (error.code === '@error auth/wrong-password' ) {
                        console.log('Wrong credentials!');
                        setError('Wrong credentials!')
                    }
                    else {
                        setError('Wrong credentials!')
                    }
                    onToggleSnackBar()
                });
        }
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
        alignItems: "stretch",
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


