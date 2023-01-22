import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList, SectionList, SafeAreaView} from 'react-native';
import React, {useEffect} from "react";
import {collection, doc, DocumentReference, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import {Button, Chip, Divider, IconButton, Modal, Portal, Searchbar, Text, useTheme} from "react-native-paper";
import {CinemaType, HallType, MovieType, SeanceType} from "../types";
import Seances from "../components/Seances";
import Movie from "../components/Movie";


export default function RepertoireScreen({ route, navigation }: any) {

    const theme = useTheme()

    const showDates = ['16.01','17.01']

    const [cinemas, setCinemas] = React.useState<Array<CinemaType>>([])
    const [allMovies, setAllMovies] = React.useState<Array<MovieType>>([])
    const [movies, setMovies] = React.useState<Array<MovieType>>([])
    const [genres, setGenres] = React.useState<Array<string>>([])
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [filter, setFilter] = React.useState<Array<string>>([])

    const [cinema, setCinema] = React.useState<string>('aYWbcNsvxBx4Mgw7DxKw')
    const [date, setDate] = React.useState<string>('16.01')
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: theme.colors.secondaryContainer, padding: 20, margin: 20, borderRadius: 20};

    React.useEffect(() => {
        if(searchQuery.length === 0){
            setMovies(allMovies)
        }
    }, [searchQuery])

    const onChangeSearch = (query: string) => {
        setSearchQuery(query)
        let tmp: Array<MovieType> = []
        allMovies.forEach((movie) => {
            if(movie.title.toLowerCase().includes(searchQuery) || movie.title.toUpperCase().includes(searchQuery) || movie.title.includes(searchQuery)){
                tmp.push(movie)
            }
        })
        setMovies(tmp)
        tmp = []
    }

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

    const extractGenres = async (movies: Array<MovieType>) => {
        let tmp: Array<string> = []
        for (const movie of movies) {
            movie.genre.forEach((genre) => {
                if(!tmp.find((item) => item === genre)){
                    tmp.push(genre)
                }
            })
        }
        return tmp
    }

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
               setMovies(moviesFromDb)
               setAllMovies(moviesFromDb)
               extractGenres(moviesFromDb).then((genres) => {
                   setGenres(genres)
               })
           })
       }
   }, [cinemas])


    const handleSetFilter = (item: string) => {
        if(isSelectedFilter(item)){
            setFilter(filter.filter((genre) => genre !== item))
        }
        else{
            setFilter([...filter, item])
        }
    }

    const handleDeleteFilters = () => {
        setFilter([])
        setMovies(allMovies)
        hideModal()
    }

    const handleApplyFilters = () => {
        let tmp: Array<MovieType> = []
        for(const movie of movies) {
            movie.genre.forEach((genre) => {
                if(filter.includes(genre)){
                    if(tmp.filter((tmpMovie) => tmpMovie === movie).length === 0){
                        tmp.push(movie)
                    }
                }
            })
        }
        setMovies(tmp)
        tmp = []
        hideModal()
    }

   const isSelectedDate = (chipDate: string) => {
       return chipDate === date
   }
   const isSelectedCinema = (chipCinema: string) => {
       return chipCinema === cinema
   }
    const isSelectedFilter = (chipGenre: string) => {
        return filter.find((genre) => genre === chipGenre) !== undefined
    }

    return (
        <SafeAreaView style={{paddingBottom: 210, backgroundColor: theme.colors.surface}}>
            <View>
                <FlatList
                    contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', paddingTop: 20 } }
                    numColumns={2}
                    data={cinemas}
                    listKey="cinemasList"
                    renderItem={({item}) =>
                        <Chip style={[styles.chip ,{ backgroundColor: theme.colors.tertiaryContainer, marginBottom: 10}]}
                              textStyle={{color: theme.colors.onTertiaryContainer}}
                              mode="flat"
                              selected={isSelectedCinema(item.id)}
                              onPress={() => setCinema(item.id)}>
                            {item.name}
                        </Chip>}
                    keyExtractor={(item: CinemaType, index) => item.id}
                />
                <FlatList
                    contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', paddingBottom: 20 } }
                    numColumns={2}
                    data={showDates}
                    listKey="datesList"
                    renderItem={({item}) =>
                        <Chip style={[styles.chip ,{ backgroundColor: theme.colors.primaryContainer}]}
                              textStyle={{color: theme.colors.onTertiaryContainer}}
                              mode="flat"
                              selected={isSelectedDate(item)}
                              onPress={() => setDate(item)}>
                            {item}
                        </Chip>}
                    keyExtractor={(item: string, index) => item}
                />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20}}>
                    <Searchbar
                        placeholder="Search"
                        style={{width: 300}}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <IconButton
                        icon="filter"
                        size={30}
                        onPress={() => showModal()}
                    />
                </View>
            </View>
            <FlatList
                contentContainerStyle={{paddingHorizontal: 20}}
                data={movies}
                listKey="moviesList"
                renderItem={({item}) => <Seances
                    movie={item}
                    cinema={cinema}
                    date={date}
                    navigation={navigation}/>}
                keyExtractor={(item: MovieType) => item.id}
            />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    {
                        genres ?
                            <FlatList
                                data={genres}
                                numColumns={3}
                                renderItem={({item}) =>
                                    <Chip style={[styles.genreChip ,{ backgroundColor: theme.colors.primaryContainer}]}
                                          textStyle={{color: theme.colors.onTertiaryContainer, textAlign: "center"}}
                                          mode="flat"
                                          selected={isSelectedFilter(item)}
                                          onPress={() => handleSetFilter(item)}>
                                        {item}
                                    </Chip>}
                            /> : null
                    }
                    <Button
                        style={{marginTop: 10}}
                        mode="elevated"
                        onPress={handleDeleteFilters}>Delete filters</Button>
                    <Button
                        style={{marginTop: 10}}
                        mode="elevated"
                        onPress={handleApplyFilters}>Filter</Button>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chip: {
        marginHorizontal: 5
    },
    genreChip: {
        margin: 5,
        width: 100
    }
});
