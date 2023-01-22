import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, Snackbar, Portal, Dialog, useTheme} from 'react-native-paper';
import React from "react";
import Seat from "../components/Seat";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {MovieType, SeanceSeatType, SeatType} from "../types";
import {db} from "../firebaseConfig";
import {useAppDispatch, useAppSelector} from "../hooks";
import {setBookedSeats} from "../features/bookingSlice";


export default function SeatsReservationScreen({ route, navigation }: any) {

    const { seanceId } = route.params;

    const [seats, setSeats] = React.useState<Array<SeanceSeatType>>([])
    const [selectedSeats, setSelectedSeats] = React.useState<Array<string>>([])
    const movie = useAppSelector(state => state.booking.movie)
    const [visible, setVisible] = React.useState(false);
    const normalTickets = useAppSelector(state => state.booking.normalTickets)
    const reducedTickets = useAppSelector(state => state.booking.reducedTickets)

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const dispatch = useAppDispatch()

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
           return seatsFromDb as Array<SeanceSeatType>
       }
       fetchData().then((seatsFromDb) => {
           setSeats(seatsFromDb);
       })
   },[])

    const theme = useTheme()

    const handleSelectSeat = async (seat: SeanceSeatType) => {
        if(selectedSeats.includes(seat.seat.id)){
            const updatedSelectedSeats = selectedSeats.filter(item => item !== seat.seat.id)
            setSelectedSeats(updatedSelectedSeats)
        }
        else{
            setSelectedSeats(current => [...current, seat.seat.id])
        }
    }

    const handleMoveToBooking = () => {
        if(selectedSeats.length !== (normalTickets + reducedTickets)){
            showDialog()
        }
        else{
            const fetchData = async (id: string) => {
                const seatRef = doc(db, 'seat', id);
                const docSnap = await getDoc(seatRef);
                return { id: docSnap.id, ...docSnap.data() } as SeatType
            }
            const saveSeats = async () => {
                const seatsToSave: Array<{ id: string, number: number }> = []
                for (const selectedSeat of selectedSeats) {
                    await fetchData(selectedSeat).then((seatFromDb) => {
                        const seat = seats.find(item => item.seat.id === selectedSeat)
                        if(seat){
                            seatsToSave.push({
                                id: seat.id,
                                number: seatFromDb.number
                            })
                        }
                    })
                }
                return seatsToSave
            }
            saveSeats().then((seatsToSave) => {
                dispatch(setBookedSeats(seatsToSave))
                navigation.navigate('Booking', { seanceId: seanceId })
            })
        }
    }

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background}}>
            <View>
                <Text style={{textAlign: "center", marginVertical: 25}} variant={"headlineLarge"}>{movie?.title}</Text>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Image style={styles.image} source={require('../assets/screen.png')}/>
                </View>
                <FlatList
                    contentContainerStyle= {{ flexGrow: 1, alignItems: 'center', paddingBottom: 70, paddingHorizontal: 10 } }
                    style={styles.list}
                    data={seats}
                    numColumns={4}
                    listKey="seatsList"
                    renderItem={({item}) => <Seat
                        available={item.available}
                        setSelectedSeats={handleSelectSeat}
                        item={item}
                        quantity={selectedSeats.length}
                        showDialog={showDialog}
                    />}
                    keyExtractor={(item: SeanceSeatType) => item.id}
                />
            </View>
            <FAB
                icon="send"
                label="Order"
                variant="tertiary"
                style={styles.fab}
                onPress={handleMoveToBooking}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                        {
                            normalTickets + reducedTickets === selectedSeats.length ?
                            <Text variant="bodyMedium">You can choose only {selectedSeats.length} seats!</Text> :
                            <Text variant="bodyMedium">Please select all seats!</Text>
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Ok</Button>
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
        width: 300,
        height: 200
    }
});
