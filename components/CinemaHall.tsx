import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import { Button, TextInput, Text, FAB } from 'react-native-paper';
import React from "react";
import Seat from "./Seat";
import {collection, getDocs, query, where} from "firebase/firestore";
import {Movie} from "../screens/MoviesScreen";
import {db} from "../firebaseConfig";

export type SeatType = {
    id: string;
    available: boolean;
    row: number;
    number: number;
}

export type PropsType = {
    seanceId: string;
}

const seatsRef = collection(db, 'seanceSeat');

export default function CinemaHall({seanceId}: PropsType) {
    const [seats, setSeats] = React.useState<Array<SeatType>>([])
    const [selectedSeats, setSelectedSeats] = React.useState<Array<String>>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const seatsFromDb: Array<any> = [];
            console.log(seanceId)
            const q = query(seatsRef, where('seance', '==', seanceId));
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                seatsFromDb.push({id: doc.id, ...doc.data()});
            })
            return seatsFromDb as Array<SeatType>
        }

        fetchData().then((seatsFromDb) => {
            setSeats(seatsFromDb);
            console.log(seatsFromDb)
        })
    },[])

    const handleSelectSeat = (id: string) => {
        console.log(id)
        if(selectedSeats.includes(id)){
            const updatedSelectedSeats = selectedSeats.filter(seatId => seatId !== id)
            setSelectedSeats(updatedSelectedSeats)
        }
        else{
            setSelectedSeats(current => [...current, id])
        }
    }

    return (
        <View>
            <View>
                <FlatList
                    contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', paddingBottom: 70, paddingHorizontal: 10 } }
                    style={styles.list}
                    data={seats}
                    numColumns={6}
                    renderItem={({item}) => <Seat available={item.available} setSelectedSeats={handleSelectSeat} itemId={item.id}/>}
                    keyExtractor={(item: SeatType) => item.id}
                />
            </View>
            <Text>Selected seats: {selectedSeats.length}</Text>
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
        marginTop: 10,
    }
});
