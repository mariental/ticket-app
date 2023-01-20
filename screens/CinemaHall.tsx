import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, Snackbar} from 'react-native-paper';
import React from "react";
import Seat from "../components/Seat";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {MovieType, SeanceType, SeatType} from "../types";
import {db} from "../firebaseConfig";


export default function CinemaHallScreen({ route, navigation }: any) {

    const { seanceId } = route.params;

    const [visible, setVisible] = React.useState<boolean>(false);
    const [seats, setSeats] = React.useState<Array<SeatType>>([])
    const [selectedSeats, setSelectedSeats] = React.useState<Array<String>>([])


   React.useEffect(() => {
       const fetchData = async () => {
           const seatsFromDb: Array<any> = [];
           const seatsRef = collection(db, 'seanceSeat');
           const seanceRef = doc(db, 'seance', seanceId)
           const q = query(seatsRef, where('seance', '==', seanceRef));
           const docSnap = await getDocs(q);
           docSnap.forEach(doc => {
               seatsFromDb.push({id: doc.id, ...doc.data()});
           })
           return seatsFromDb as Array<SeatType>
       }
       fetchData().then((seatsFromDb) => {
           setSeats(seatsFromDb);
       })
   },[])


    const handleSelectSeat = (id: string) => {
        if(selectedSeats.includes(id)){
            const updatedSelectedSeats = selectedSeats.filter(seatId => seatId !== id)
            setSelectedSeats(updatedSelectedSeats)
        }
        else{
            setSelectedSeats(current => [...current, id])
        }
    }


    return (
        <View style={{ flex: 1, padding: 10}}>
            <View>
                <Text style={{textAlign: "center"}} variant={"headlineLarge"}>Black Panther: Wakanda Forever</Text>
                <FlatList
                    contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', paddingBottom: 70, paddingHorizontal: 10 } }
                    style={styles.list}
                    data={seats}
                    numColumns={4}
                    listKey="seatsList"
                    renderItem={({item}) => <Seat available={item.available} setSelectedSeats={handleSelectSeat} itemId={item.id}/>}
                    keyExtractor={(item: SeatType) => item.id}
                />
                <Text>Selected seats: {selectedSeats.length}</Text>
            </View>
            <FAB
                icon="send"
                label="Order"
                style={styles.fab}
                onPress={() => navigation.navigate('Order', { seanceId: seanceId })}
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
        marginTop: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});
