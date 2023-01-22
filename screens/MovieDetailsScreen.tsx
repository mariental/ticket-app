import {SafeAreaView, Image, StyleSheet, ScrollView, FlatList, View} from 'react-native';
import {Button, TextInput, Text, FAB, Portal, Modal, Chip, useTheme} from 'react-native-paper';
import React from "react";
import {auth, db} from '../firebaseConfig';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {MovieType, ReviewType, SeanceType} from "../types";
import AddOpinion from "../components/AddOpinion";
import Review from "../components/Review";

export default function MovieDetailsScreen({ route, navigation }: any) {

    const [movie, setMovie] = React.useState<MovieType>()
    const [reviews, setReviews] = React.useState<Array<ReviewType>>([])
    const [visible, setVisible] = React.useState(false);

    const { id } = route.params;
    const theme = useTheme()

    React.useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'movie', id);
            const docSnap = await getDoc(docRef);
            return docSnap.data() as MovieType
        }

        fetchData().then((movieFromDb) => {
            setMovie(movieFromDb);
        })
    }, [])

    React.useEffect(() => {
        const fetchData = async () => {
            const reviewsFromDb: Array<any> = [];
            const movieRef = doc(db, 'movie', id)
            const docRef = collection(db, 'review');
            const q = query(docRef, where('movie', '==', movieRef));
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                reviewsFromDb.push({id: doc.id, ...doc.data()});
            })
            return reviewsFromDb as Array<ReviewType>
        }

        fetchData().then((reviewsFromDb) => {
            setReviews(reviewsFromDb)
        })
    }, [movie])

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: theme.colors.secondaryContainer, padding: 20, margin: 20, borderRadius: 20};

    return (
        <SafeAreaView style={{backgroundColor: theme.colors.surface}}>
            <ScrollView contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 10 }}>
                <View style={styles.container}>
                    <Image style={styles.image} source={{ uri: movie?.image }} />
                    <Text style={styles.text} variant="titleLarge">{movie?.title}</Text>
                    <Text style={styles.text} variant="labelSmall">{movie?.production} | {movie?.genre} | {movie?.duration}</Text>
                    <Text style={styles.synopsis} variant="labelMedium">{movie?.synopsis}</Text>
                    <Text style={styles.text} variant="labelSmall">Director: {movie?.director}</Text>
                    <Text style={styles.text} variant="labelSmall">Cast: {movie?.cast}</Text>
                </View>
                <Text style={styles.synopsis} variant={"titleLarge"}>Reviews </Text>
                {reviews.map((review) =>
                    <Review review={review} key={review.id}/>
                )}
            </ScrollView>
            {
                auth.currentUser ? <FAB
                    icon="plus"
                    label="Add opinion"
                    style={styles.fab}
                    variant="tertiary"
                    onPress={showModal}
                /> : null
            }
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <AddOpinion/>
                    <Button mode="elevated" style={{marginVertical: 20}} onPress={hideModal}>Add</Button>
                </Modal>
            </Portal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    image: {
        width: 250,
        height: 350,
        borderRadius: 30,
        marginVertical: 15
    },
    text:{
        marginBottom: 10
    },
    synopsis: {
        marginBottom: 10,
        textAlign: "center"
    },
    container: {
        flexDirection: "column",
        alignItems: "center"
    }
});
