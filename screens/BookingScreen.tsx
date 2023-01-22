import {View, StyleSheet, Image} from 'react-native';
import {Button, TextInput, Text, DataTable, Portal, Dialog, useTheme} from 'react-native-paper';
import React from "react";
import {useAppDispatch, useAppSelector} from "../hooks";
import { TextInputMask } from 'react-native-masked-text'
import {doc, DocumentReference, getDoc, addDoc, collection} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import {SeanceType, SeatType} from "../types";
import {clearBooking} from "../features/booking/bookingSlice";

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
    const [visible, setVisible] = React.useState(false)
    const [blikNumber, onChangeBlikNumber] = React.useState<string>('')

    const theme = useTheme()

    const dispatch = useAppDispatch()
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);


    const handleGenerateTicket = async () => {
        const user = auth.currentUser;
        if(seance !== null){
            let id :string = seance.id!
            const seanceRef = doc(db, 'seance', id)
            const docRef = await addDoc(collection(db, 'ticket'), {
                user: user?.email,
                seance: seanceRef,
                price: (reducedTickets * 10 + normalTickets * 20),
                seats: bookedSeats
            });
            console.log(docRef)
        }
        dispatch(clearBooking())
        hideDialog();
        navigation.navigate('Tickets');
    }
    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background}}>
            <View style={styles.row}>
                <View>
                    <Text variant={"headlineLarge"} style={{marginVertical: 10}}>Your order</Text>
                    <Text variant={"bodyLarge"}>{movie?.title}</Text>
                    <Text variant={"bodyLarge"}>Date: {seance?.date}.2023</Text>
                    <Text variant={"bodyLarge"}>Time: {seance?.time}</Text>
                    <Text variant={"bodyLarge"}>Seats: {bookedSeats.map((seat) => seat + ', ')}</Text>
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
                onPress={showDialog}>
                Pay and get ticket
            </Button>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Enter blik number</Dialog.Title>
                    <Dialog.Content>
                            <View>
                                <TextInput
                                    label="Blik number"
                                    mode="outlined"
                                    onChangeText={onChangeBlikNumber}
                                    value={blikNumber}
                                    render={props =>
                                        <TextInputMask
                                            {...props}
                                            type={'custom'}
                                            options={
                                                {
                                                    mask: "999-999"
                                                }
                                            }
                                        />
                                    }
                                />
                            </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleGenerateTicket}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
