import { SafeAreaView, TextInput, StyleSheet, Text, Button, Alert } from 'react-native';
import React from "react";

export default function LoginScreen({ navigation }: any) {

    const [email, onChangeEmail] = React.useState<string>('');
    const [password, onChangePassword] = React.useState<string>('');

    const handleSubmit = (): void => {
        Alert.alert('Simple Button pressed');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Login to your account</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
            />
            <Button
                title="submit"
                color="#f194ff"
                onPress={handleSubmit}
            />
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
    }
});



