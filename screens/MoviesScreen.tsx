import {View, FlatList, ScrollView, SafeAreaView, ListRenderItem } from 'react-native';
import React from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, DocumentData } from "firebase/firestore";
import Movie from "../components/Movie";

const moviesRef = collection(db, 'movie');

export type Movie = {
    id?: string;
    title: string;
    image: string;
    premiere: string;
    cast: string;
    synopsis: string;
    director: string;
    duration: string;
    genre: string;
    age_limit: string;
    language: string;
    production: string;
}

export default function MoviesScreen({ navigation }: any) {

    const [movies, setMovies] = React.useState<Array<Movie>>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const moviesFromDb: Array<any> = [];
            const docSnap = await getDocs(moviesRef);
            docSnap.forEach(doc => {
                moviesFromDb.push({id: doc.id, ...doc.data()});
            })
            return moviesFromDb as Array<Movie>
        }

        fetchData().then((moviesFromDb) => {
            setMovies(moviesFromDb);
        })
    }, [])

    return (
        <View>
            <FlatList
                data={movies}
                renderItem={({item}) => <Movie title={item.title} image={item.image} navigation={navigation}/>}
                keyExtractor={(item: Movie) => item.id}
            />
        </View>
    );
}


