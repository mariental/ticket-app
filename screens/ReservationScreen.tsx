import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import React from "react";
import {collection, doc, DocumentReference, getDocs, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import CinemaHall, {SeatType} from "../components/CinemaHall";
import Seat from "../components/Seat";
import {Chip, Text} from "react-native-paper";

export type SeanceType= {
    id: string;
    time: string;
    date: string;
    movie: DocumentReference;
    hall: DocumentReference;
}

export default function ReservationScreen({ route, navigation }: any) {

    const showTimes = ['8.00', '12.00','16.00','20.00']
    const showDates = ['16.01','17.01']

    const [seances, setSeances] = React.useState<Array<SeanceType>>([])
    const [time, setTime] = React.useState<string>('8.00')
    const [date, setDate] = React.useState<string>('16.01')
    const [selectedSeance, setSelectedSeance] = React.useState<SeanceType>()

    const { movieId } = route.params;

    React.useEffect(() => {
        const fetchData = async () => {
            const seancesFromDb: Array<any> = [];
            const movieRef = doc(db, 'movie', movieId);
            const seanceRef = collection(db, 'seance');
            const q = query(seanceRef, where("movie", "==", movieRef));
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                seancesFromDb.push({id: doc.id, ...doc.data()});
            })
            return seancesFromDb as Array<SeanceType>
        }

        fetchData().then((seancesFromDb) => {
            setSeances(seancesFromDb);
            const seance = seances.find(item => item.time === time && item.date === date)
            setSelectedSeance(seance)
        })
    }, [])

    React.useEffect(() => {
        handleChange()
    }, [time, date])

    const isSelectedTime = (chipTime: string) => {
        return chipTime === time
    }
    const isSelectedDate = (chipTime: string) => {
        return chipTime === date
    }

    const handleChange = () => {
        const seance = seances.find(item => item.time === time && item.date === date)
        setSelectedSeance(seance)
    }

    return (
        <View>
            <FlatList
                contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', padding: 10 } }
                numColumns={5}
                data={showDates}
                renderItem={({item}) => <Chip style={styles.chip} selected={isSelectedDate(item)} onPress={() => setDate(item)}>{item}</Chip>}
            />
            <FlatList
                contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', padding: 10 } }
                numColumns={5}
                data={showTimes}
                renderItem={({item}) => <Chip style={styles.chip} selected={isSelectedTime(item)} onPress={() => setTime(item)}>{item}</Chip>}
            />
            {selectedSeance !== undefined ? <CinemaHall seanceId={selectedSeance.id}/> : <Text>Please select seance</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        marginHorizontal:10
    }
});
