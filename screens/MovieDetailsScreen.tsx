import {SafeAreaView, Image, StyleSheet, ScrollView, StatusBar} from 'react-native';
import { Button, TextInput, Text, FAB } from 'react-native-paper';
import React from "react";
import { db } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { Movie } from "./MoviesScreen";


export default function MovieDetailsScreen({ route, navigation }: any) {

    const [movie, setMovie] = React.useState<Movie | null>(null)

    const { id } = route.params;

    React.useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'movie', id);
            const docSnap = await getDoc(docRef);
            return docSnap.data() as Movie
        }

        fetchData().then((movieFromDb) => {
            setMovie(movieFromDb);
        })
    }, [])

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 70, paddingHorizontal: 10 }}>
                <Image style={styles.image} source={{ uri: movie?.image }} />
                <Text style={styles.text} variant="titleLarge">{movie?.title}</Text>
                <Text style={styles.text} variant="labelSmall">{movie?.production} | {movie?.genre} | {movie?.duration}</Text>
                <Text style={styles.synopsis} variant="labelMedium">{movie?.synopsis}</Text>
                <Text style={styles.text} variant="labelSmall">Director: {movie?.director}</Text>
                <Text style={styles.text} variant="labelSmall">Cast: {movie?.cast}</Text>
            </ScrollView>
            <FAB
                icon="plus"
                label="Get Reservation"
                style={styles.fab}
                onPress={() => console.log('Pressed')}
            />
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
        width: 180,
        height: 250,
        borderRadius: 12,
        marginVertical: 15
    },
    text:{
        marginBottom: 10
    },
    synopsis: {
        marginBottom: 10,
        textAlign: "center"
    }
});
