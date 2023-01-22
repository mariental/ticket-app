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

    const fetchReviews = async () => {
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

    React.useEffect(() => {
        fetchReviews().then((reviewsFromDb) => {
            setReviews(reviewsFromDb)
        })
    }, [movie])

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: theme.colors.secondaryContainer, padding: 20, margin: 20, borderRadius: 20};

    const getReviews = () => {
        fetchReviews().then((reviewsFromDb) => {
            setReviews(reviewsFromDb)
        })
    }


    return (
        <SafeAreaView style={{backgroundColor: theme.colors.surface, flex: 1}}>
            <ScrollView contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 10 }}>
                <View style={styles.container}>
                    <Image style={styles.image} source={{ uri: movie?.image }} />
                    <Text style={styles.title} variant="titleLarge">{movie?.title}</Text>
                    <Text style={styles.text} variant="labelMedium">{movie?.production} | {movie?.duration}</Text>
                    <View style={{flexDirection: "row", marginBottom: 10}}>
                        {movie?.genre.map((genre) =>
                            <Chip
                                style={{backgroundColor: theme.colors.tertiaryContainer, marginHorizontal: 10}}
                                textStyle={{color: theme.colors.onTertiaryContainer}}
                                mode="flat"
                                key={genre}
                            >
                                {genre}
                            </Chip>
                        )}
                    </View>
                    <Text style={styles.synopsis} variant="labelMedium">{movie?.synopsis}</Text>
                </View>
                { reviews.length > 0 ?
                        <View>
                            <Text style={styles.synopsis} variant={"titleLarge"}>Reviews</Text>
                            {reviews.map((review) =>
                                <Review review={review} key={review.id} getReviews={getReviews}/>
                            )}
                        </View>
                    : null
                }
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
                    {movie !== undefined ? <AddOpinion movie={id} getReviews={getReviews} hideModal={hideModal}/> : null }
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
    title: {
        marginBottom: 10,
        textAlign: "center"
    },
    synopsis: {
        margin: 20,
        textAlign: "center"
    },
    container: {
        flexDirection: "column",
        alignItems: "center"
    }
});
