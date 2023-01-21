import { View, StyleSheet } from 'react-native';
import React from "react";
import { auth } from "../firebaseConfig";
import {signOut, User} from "firebase/auth";
import {Button, Portal, Modal, TextInput, Text, useTheme} from 'react-native-paper';
import { deleteUser, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {useAppDispatch} from "../hooks";

export default function ProfileScreen({ navigation }: any) {

    const theme = useTheme()

    const [user, setUser] = React.useState<User | null>(null);
    const [oldPassword, onChangeOldPassword] = React.useState<string>('');
    const [newPassword, onChangeNewPassword] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<string>('');

    React.useEffect(() => {
        const user = auth.currentUser;
        if(user){
            setUser(user);
        }
        else{
            navigation.navigate('Home')
        }
    }, [])

    const handleChangePassword = (): void => {
        if(user){
            const credential = EmailAuthProvider.credential(
                user.email || "",
                oldPassword
            );
            reauthenticateWithCredential(user, credential).then(() => {
                signOut(auth)
                    .then(() => {
                        updatePassword(user, newPassword).then(() => {
                            handleLogout();
                        }).catch((error) => {
                            console.log(error)
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const handleDeleteAccount = (): void => {
        if(user){
            const credential = EmailAuthProvider.credential(
                user.email || "",
                oldPassword
            );
            reauthenticateWithCredential(user, credential).then(() => {
                deleteUser(user).then(() => {
                    handleLogout();
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }

    }

    const handleLogout = (): void => {
        signOut(auth)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch(error => {
                console.log(error);
            })
    }

    const showPasswordModal = () => {
        setVisible(true);
        setContent('password');
    }
    const showDeleteModal = () => {
        setVisible(true);
        setContent('delete');
    }
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: theme.colors.background, padding: 50, margin: 20, borderRadius: 30};

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{marginHorizontal: 20, marginTop: 40, padding: 50, backgroundColor: theme.colors.secondaryContainer, borderRadius: 30}}>
                <Text variant="titleLarge" style={{textAlign: "center", marginBottom: 30}}>Hello {user?.email}</Text>
                <Button
                    style={{marginTop: 10}}
                    mode="elevated"
                    onPress={showPasswordModal}>Change password</Button>
                <Button
                    style={{marginTop: 10}}
                    mode="elevated"
                    onPress={showDeleteModal}>Delete account</Button>
                <Button
                    style={{marginTop: 10}}
                    mode="elevated"
                    onPress={handleLogout}>Logout</Button>
            </View>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    {content == 'password' ?
                        <>
                        <TextInput
                            style={styles.input}
                            label="Old Password"
                            mode="outlined"
                            secureTextEntry={true}
                            onChangeText={onChangeOldPassword}
                            value={oldPassword}
                        />
                        <TextInput
                            style={styles.input}
                            label="New Password"
                            mode="outlined"
                            secureTextEntry={true}
                            onChangeText={onChangeNewPassword}
                            value={newPassword}
                        />
                        <Button
                            style={{marginTop: 10}}
                            mode="contained"
                            onPress={handleChangePassword}>Confirm</Button>
                        </> :
                        <>
                            <TextInput
                                style={styles.input}
                                label="Account password"
                                mode="outlined"
                                secureTextEntry={true}
                                onChangeText={onChangeOldPassword}
                                value={oldPassword}
                            />
                            <Button
                                style={{marginTop: 10}}
                                mode="contained"
                                onPress={handleDeleteAccount}>Confirm</Button>
                        </>
                    }
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10
    }
});


