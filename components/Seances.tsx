import {View, Image, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import React from "react";
import {CinemaType, HallType, SeanceType} from "../types";
import {Chip, Text, Button, Dialog, Portal, Provider } from "react-native-paper"
import {collection, doc, DocumentReference, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import MovieSeance from './MovieSeance'

type PropsType = {
    movieId: string;
    movieImage: string;
    movieTitle: string;
    cinema: string;
    date: string;
    navigation: any;
}

export default function Seances(props: PropsType) {

    const [halls, setHalls] = React.useState<Array<DocumentReference>>([])
    const [seances, setSeances] = React.useState<Array<SeanceType>>([])

    React.useEffect(() => {
        const fetchHalls = async () => {
            const hallsFromDb: Array<any> = [];
            const hallRef = collection(db, 'hall');
            const cinemaRef = doc(db, 'cinema', props.cinema);
            const q = query(hallRef, where("cinema", "==", cinemaRef));
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                hallsFromDb.push({id: doc.id, ...doc.data()});
            })
            return hallsFromDb as Array<HallType>
        }
        fetchHalls().then((hallsFromDb) => {
            if(hallsFromDb){
                const tmp: Array<DocumentReference> = []
                hallsFromDb.forEach((hall) => {
                    tmp.push(doc(db, 'hall', hall.id))
                })
                setHalls(tmp)
            }
        })
    }, [])

    React.useEffect(() => {
        const fetchSeances = async () => {
            const seancesFromDb: Array<any> = [];
            const movieRef = doc(db, 'movie', props.movieId)
            const seanceRef = collection(db, 'seance');
            const q = query(seanceRef,
                where('movie', '==', movieRef),
                where('date', '==', props.date),
                where('hall','in', halls)
            );
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                seancesFromDb.push({id: doc.id, ...doc.data()});
            })
            return seancesFromDb as Array<SeanceType>
        }
        if(halls && halls.length > 0){
            fetchSeances().then((seancesFromDb) => {
                if(seancesFromDb) {
                    setSeances(seancesFromDb)
                }
            })
        }
    }, [halls])

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: props.movieImage}} />
            <Text style={styles.text} variant="titleLarge">{props.movieTitle}</Text>
            <MovieSeance seances={seances} navigation={props.navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    image: {
        width: 180,
        height: 250,
        borderRadius: 12,
        marginVertical: 15
    },
    text:{
        marginBottom: 10,
        textAlign: "center"
    }
});
