import {Image, StyleSheet} from 'react-native';
import {Text, useTheme, Card, Avatar, Button, IconButton, Portal, Dialog} from 'react-native-paper';
import React from "react";
import { ReviewType } from "../types";
import {auth, db} from "../firebaseConfig";
import {doc, deleteDoc} from "firebase/firestore";

export type PropsType = {
    review: ReviewType;
    getReviews: Function;
}

export default function Review(props: PropsType) {

    const theme = useTheme()
    const subtitle = 'Rate: ' + props.review.rate + '/5'
    const [editable, setEditable] = React.useState(false)
    const [visible, setVisible] = React.useState(false);
    const [profilePhoto, setProfilePhoto] = React.useState<string | null | undefined>(null);


    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    React.useEffect(() => {
        if(auth.currentUser?.email === props.review.user){
            setEditable(true)
        }
        if(auth.currentUser?.photoURL){
            setProfilePhoto(auth.currentUser?.photoURL)
        }
    }, [])

    const handleDelete = async () => {
        await deleteDoc(doc(db, "review", props.review.id))
    }

    return (
        <Card style={{ backgroundColor: theme.colors.secondaryContainer, borderRadius: 20, padding: 20, marginBottom: 20}}>
            {
                profilePhoto && editable ?
                    <Card.Title
                        title={props.review.user}
                        subtitle={subtitle}
                        left={(props) => <Image source={{ uri: profilePhoto }} style={{width: 52, height: 52, borderRadius: 50}}/>}
                        leftStyle={{marginRight: 30, marginTop: 5}}
                        right={ editable ? (props) =>
                                <IconButton {...props} icon="close" onPress={() => showDialog()} /> :
                            undefined
                        }
                    />
                    :
                    <Card.Title
                        title={props.review.user}
                        subtitle={subtitle}
                        leftStyle={{marginRight: 30, marginTop: 5}}
                        left={ (props) => <Avatar.Icon {...props} icon="account" size={50}/>}
                    />
            }
            <Card.Content>
                <Text variant="bodyMedium">{props.review.content}</Text>
            </Card.Content>
            <Portal>
                <Dialog visible={visible} onDismiss={() => {hideDialog()}}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Are you sure you want to delete review?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {hideDialog()}}>No</Button>
                        <Button onPress={() => {handleDelete().then(props.getReviews())}}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Card>
    );
}

const styles = StyleSheet.create({
});
