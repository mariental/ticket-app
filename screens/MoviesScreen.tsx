import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import React from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, DocumentData } from "firebase/firestore";
import Movie from "../components/Movie";
import {MovieType} from "../types";

const moviesRef = collection(db, 'movie');

export default function MoviesScreen({ navigation }: any) {

    const [movies, setMovies] = React.useState<Array<MovieType>>([])
    const [searchQuery, setSearchQuery] = React.useState<string>('');

    const onChangeSearch = (query: string) => setSearchQuery(query);

    React.useEffect(() => {
        const fetchData = async () => {
            const moviesFromDb: Array<any> = [];
            const docSnap = await getDocs(moviesRef);
            docSnap.forEach(doc => {
                moviesFromDb.push({id: doc.id, ...doc.data()});
            })
            return moviesFromDb as Array<MovieType>
        }

        fetchData().then((moviesFromDb) => {
            setMovies(moviesFromDb);
        })
    }, [])

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <FlatList
                style={styles.list}
                data={movies}
                listKey="moviesList"
                renderItem={({item}) => <Movie id={item.id} title={item.title} image={item.image} navigation={navigation}/>}
                keyExtractor={(item: MovieType) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: "center"
    },
    list: {
        marginTop: 10
    }
});

