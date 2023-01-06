import { Button, Text, View, Image } from 'react-native';
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
        <View>
            <Text>{movie?.title}</Text>
        </View>
    );
}


