import { Text, View, StyleSheet } from 'react-native';
import React from "react";
import { auth } from "../firebaseConfig";
import {signOut, User} from "firebase/auth";
import {Button, Portal, Modal, TextInput} from 'react-native-paper';
import { deleteUser, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function ProfileScreen({ navigation }: any) {

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
    const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20};

    return (
        <View>
            <Text>{user?.email}</Text>
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
                            mode="elevated"
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
                                mode="elevated"
                                onPress={handleDeleteAccount}>Confirm</Button>
                        </>
                    }
                </Modal>
            </Portal>
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
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10
    }
});


