import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList, SectionList, SafeAreaView} from 'react-native';
import React, {useEffect} from "react";
import {collection, doc, DocumentReference, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {Chip, Text} from "react-native-paper";
import {CinemaType, HallType, MovieType, SeanceType} from "../types";
import Seances from "../components/Seances";
import Movie from "../components/Movie";


export default function RepertoireScreen({ route, navigation }: any) {

    const showDates = ['16.01','17.01']

    const [cinemas, setCinemas] = React.useState<Array<CinemaType>>([])
    const [movies, setMovies] = React.useState<Array<MovieType>>([])

    const [cinema, setCinema] = React.useState<string>('aYWbcNsvxBx4Mgw7DxKw')
    const [date, setDate] = React.useState<string>('16.01')


   React.useEffect(() => {
       const fetchCinemas = async () => {
           const cinemasFromDb: Array<any> = [];
           const docSnap = await getDocs(collection(db, 'cinema'));
           docSnap.forEach(doc => {
               cinemasFromDb.push({id: doc.id, ...doc.data()});
           })
           return cinemasFromDb as Array<CinemaType>
       }
       fetchCinemas().then((cinemasFromDb) => {
           setCinemas(cinemasFromDb);
       })
   },[cinema, date])

   React.useEffect(() => {
       const fetchMovies = async () => {
           const moviesFromDb: Array<any> = [];
           const movieRef = collection(db, 'movie');
           const docSnap = await getDocs(movieRef);
           docSnap.forEach(doc => {
               moviesFromDb.push({id: doc.id, ...doc.data()});
           })
           return moviesFromDb as Array<MovieType>
       }
       if(cinemas && cinemas.length > 0){
           fetchMovies().then((moviesFromDb) => {
               setMovies(moviesFromDb);
           })
       }
   }, [cinemas])


   const isSelectedDate = (chipDate: string) => {
       return chipDate === date
   }
   const isSelectedCinema = (chipCinema: string) => {
       return chipCinema === cinema
   }

    return (
        <SafeAreaView style={{paddingBottom: 150}}>
            <FlatList
                contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', padding: 20 } }
                numColumns={3}
                data={cinemas}
                listKey="cinemasList"
                renderItem={({item}) => <Chip style={styles.chip} selected={isSelectedCinema(item.id)} onPress={() => setCinema(item.id)}>{item.name}</Chip>}
                keyExtractor={(item: CinemaType, index) => item.id}
            />
            <FlatList
                contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', padding: 10, marginBottom: 20 } }
                numColumns={2}
                data={showDates}
                listKey="datesList"
                renderItem={({item}) => <Chip style={styles.chip} selected={isSelectedDate(item)} onPress={() => setDate(item)}>{item}</Chip>}
                keyExtractor={(item: string, index) => item}
            />
            <FlatList
                contentContainerStyle={{paddingHorizontal: 20}}
                data={movies}
                listKey="moviesList"
                renderItem={({item}) => <Seances
                    movieId={item.id}
                    movieImage={item.image}
                    movieTitle={item.title}
                    cinema={cinema}
                    date={date}
                    navigation={navigation}/>}
                keyExtractor={(item: MovieType) => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chip: {
        marginHorizontal: 5
    }
});
