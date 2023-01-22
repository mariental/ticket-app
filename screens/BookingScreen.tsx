import {View, StyleSheet, Image} from 'react-native';
import {Button, TextInput, Text, DataTable, Portal, Dialog, useTheme} from 'react-native-paper';
import React from "react";
import {useAppDispatch, useAppSelector} from "../hooks";
import {doc, DocumentReference, addDoc, collection, updateDoc} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import {clearBooking} from "../features/bookingSlice";

export type Ticket = {
    seance: DocumentReference;
    price: number;
    seats: Array<number>;
}

export default function BookingScreen({ route, navigation }: any) {

    const { seanceId } = route.params;

    const movie = useAppSelector(state => state.booking.movie)
    const seance = useAppSelector(state => state.booking.seance)
    const bookedSeats = useAppSelector(state => state.booking.seats)
    const normalTickets = useAppSelector(state => state.booking.normalTickets)
    const reducedTickets = useAppSelector(state => state.booking.reducedTickets)

    const theme = useTheme()

    const dispatch = useAppDispatch()

    const updateSeats = async () => {
        for (const seat of bookedSeats) {
            const seatRef = doc(db, "seanceSeat", seat.id)
            await updateDoc(seatRef, {
                available: false
            });
        }
    }

    const handleGenerateTicket = async () => {
        const user = auth.currentUser;
        const seatsNumbers : Array<number> = []
        bookedSeats.forEach((seat) => {
            seatsNumbers.push(seat.number)
        })
        if(seance !== null){
            let id :string = seance.id!
            const seanceRef = doc(db, 'seance', id)
            const docRef = await addDoc(collection(db, 'ticket'), {
                user: user?.email,
                seance: seanceRef,
                price: (reducedTickets * 10 + normalTickets * 20),
                seats: seatsNumbers
            });
            if(docRef){
                await updateSeats()
            }
        }
        dispatch(clearBooking())
        navigation.navigate('Repertoire')
    }
    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background}}>
            <View style={styles.row}>
                <View style={{width: 200}}>
                    <Text variant={"headlineLarge"} style={{marginVertical: 10}}>Your order</Text>
                    <Text variant={"bodyLarge"} style={{ overflow: "hidden" }}>{movie?.title}</Text>
                    <Text variant={"bodyLarge"}>Date: {seance?.date}.2023</Text>
                    <Text variant={"bodyLarge"}>Time: {seance?.time}</Text>
                    <Text variant={"bodyLarge"}>Seats: {bookedSeats.map((seat) => seat.number + ', ')}</Text>
                </View>
                <View>
                    <Image style={styles.image} source={{ uri: movie?.image }} />
                </View>
            </View>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Ticket type</DataTable.Title>
                    <DataTable.Title numeric>Number</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                    <DataTable.Cell>Normal</DataTable.Cell>
                    <DataTable.Cell numeric>{normalTickets}</DataTable.Cell>
                    <DataTable.Cell numeric>{normalTickets * 20} PLN</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>Reduced</DataTable.Cell>
                    <DataTable.Cell numeric>{reducedTickets}</DataTable.Cell>
                    <DataTable.Cell numeric>{reducedTickets * 10} PLN</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>Total</DataTable.Cell>
                    <DataTable.Cell numeric>{reducedTickets * 10 + normalTickets * 20} PLN</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
            <Button
                style={{marginTop: 20}}
                mode="contained"
                onPress={handleGenerateTicket}>
                Get ticket
            </Button>
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
    },
    image: {
        width: 130,
        height: 180,
        borderRadius: 30,
        marginVertical: 15
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    }
});
