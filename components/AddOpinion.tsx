import {StyleSheet, View, Image, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, IconButton, Dialog, Portal} from 'react-native-paper';
import React from "react";
import {TextInputMask} from "react-native-masked-text";
import {auth, db} from "../firebaseConfig";
import {addDoc, collection, doc, getDocs, query, where} from "firebase/firestore";
import {clearBooking} from "../features/bookingSlice";
import {MovieType, ReviewType} from "../types";

interface PropsType {
    movie: string;
    getReviews: Function;
    hideModal: Function;
}

export const fetchReviews = async () => {
    const user = auth.currentUser
    const reviewsFromDb: Array<any> = [];
    const docRef = collection(db, 'review');
    const q = query(docRef, where('user', '==', user?.email));
    const docSnap = await getDocs(q);
    docSnap.forEach(doc => {
        reviewsFromDb.push({id: doc.id, ...doc.data()});
    })
    return reviewsFromDb as Array<ReviewType>
}

export default function AddOpinion(props: PropsType) {

    const [content, setContent] = React.useState<string>('')
    const [rate, setRate] = React.useState<number>(1)
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleAddOpinion = async () => {
        const user = auth.currentUser
        await fetchReviews().then(async (reviewsFromDb) => {
            console.log(reviewsFromDb.length)
            if(reviewsFromDb.length > 0){
                showDialog()
            }
            else{
                const movieRef = doc(db, 'movie', props.movie)
                const docRef = await addDoc(collection(db, 'review'), {
                    user: user?.email,
                    rate: rate,
                    movie: movieRef,
                    content: content
                });
                console.log(docRef)
                props.hideModal()
                props.getReviews()
            }
        })
    }

    const rates = [1,2,3,4,5]

        return (
        <View >
            <View>
                <FlatList
                    data={rates}
                    numColumns={5}
                    renderItem={({item}) =>
                        <IconButton
                            icon={rate >= item ? "star" : "star-outline"}
                            size={30}
                            selected={rate >= item}
                            onPress={() => setRate(item)}
                        />
                    }
                />
            </View>
            <TextInput
                label="Opinion content"
                mode="outlined"
                onChangeText={setContent}
                value={content}
                multiline={true}
                numberOfLines={8}
            />
            <Button mode="elevated" style={{marginVertical: 20}} onPress={handleAddOpinion}>Add</Button>
            <Portal>
                <Dialog visible={visible} onDismiss={() => {hideDialog(); props.hideModal()}}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">You already added review</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {hideDialog(); props.hideModal()}}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50
    }
});
