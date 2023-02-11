import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import React from "react";
import { auth } from "../firebaseConfig";
import {signOut, User, updateProfile} from "firebase/auth";
import {Button, Portal, Modal, TextInput, Text, useTheme, IconButton} from 'react-native-paper';
import { deleteUser, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {useAppDispatch} from "../hooks";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }: any) {

    const theme = useTheme()

    const [user, setUser] = React.useState<User | null>(null);
    const [oldPassword, onChangeOldPassword] = React.useState<string>('');
    const [newPassword, onChangeNewPassword] = React.useState<string>('');
    const [visible, setVisible] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<string>('');
    const [image, setImage] = React.useState<string | null | undefined>(null);

    React.useEffect(() => {
        const user = auth.currentUser;
        if(user){
            setUser(user);
            if(user.photoURL){
                setImage(user.photoURL)
            }
        }
        else{
            navigation.navigate('Login')
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if(auth.currentUser !== null){
                updateProfile(auth.currentUser, {
                    photoURL: result.assets[0].uri
                }).then(() => {
                    setImage(auth.currentUser?.photoURL)
                }).catch((error) => {
                    console.log(error)
                });
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{marginHorizontal: 20, marginTop: 40, padding: 50, backgroundColor: theme.colors.secondaryContainer, borderRadius: 30}}>
                <View style={{flexDirection: "column", marginBottom: 40, alignItems: "center"}}>
                    {image ?
                        <View>
                            <Image source={{ uri: image }} style={{ width: 110, height: 110, borderRadius: 100 }}/>
                            <IconButton
                                icon="pencil"
                                iconColor={theme.colors.primary}
                                style={{position: "absolute", marginTop: 60, marginLeft: 60}}
                                size={50}
                                onPress={() => pickImage()}
                            />
                        </View> :
                        <IconButton
                            icon="account-edit"
                            size={80}
                            mode="outlined"
                            onPress={() => pickImage()}
                        />
                    }
                </View>
                <Text variant="titleLarge" style={{textAlign: "center", marginBottom: 30}}>Hello {user?.displayName}!</Text>
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


