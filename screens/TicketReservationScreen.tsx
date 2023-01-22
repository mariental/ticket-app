import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, Snackbar, useTheme, Divider, Portal, Dialog} from 'react-native-paper';
import React from "react";
import Seat from "../components/Seat";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {MovieType, SeanceType, SeatType} from "../types";
import {db} from "../firebaseConfig";
import DropDownPicker from 'react-native-dropdown-picker';
import {useAppDispatch, useAppSelector} from "../hooks";
import {setTickets} from "../features/booking/bookingSlice";

export type TicketType = {
    id: string;
    type: string;
    price: number;
}

export default function TicketReservationScreen({ route, navigation }: any) {

    const theme = useTheme()

    const { seanceId } = route.params;

    const [normalTicketNumber, setNormalTicketNumber] = React.useState<number>(0)
    const [reducedTicketNumber, setReducedTicketNumber] = React.useState<number>(0)
    const movie = useAppSelector(state => state.booking.movie)

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [numbers, setNumbers] = React.useState([
        {label: '0', value: 0},
        {label: '1', value: 1},
        {label: '2', value: 2}
        ]
    );
    const [visible, setVisible] = React.useState(false);

    const dispatch = useAppDispatch()

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleMoveToSeatsSelect = () => {
        if(normalTicketNumber == 0 && reducedTicketNumber == 0){
            showDialog()
        }
        else{
            dispatch(setTickets({normalTickets: normalTicketNumber, reducedTickets: reducedTicketNumber}))
            navigation.navigate('SeatsReservation', { seanceId: seanceId })
        }
    }

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background}}>
            <Text style={{textAlign: "center", marginVertical: 25}} variant={"headlineLarge"}>{movie?.title}</Text>
            <Text style={{textAlign: "center", marginVertical: 20}} variant={"titleLarge"}>Choose tickets number</Text>
            <View style={{
                backgroundColor: theme.colors.secondaryContainer,
                paddingHorizontal: 40 ,
                paddingVertical: 30,
                borderRadius: 20
            }}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20}}>
                    <Text variant={"titleLarge"}>Normal ticket: </Text>
                    <DropDownPicker
                        style={{backgroundColor: theme.colors.onSurface}}
                        containerStyle={{ width: 120}}
                        open={open1}
                        value={normalTicketNumber}
                        items={numbers}
                        setOpen={setOpen1}
                        setValue={setNormalTicketNumber}
                        setItems={setNumbers}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                </View>
                <Divider bold={true}/>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20}}>
                    <Text variant={"titleLarge"}>Reduced: </Text>
                    <DropDownPicker
                        containerStyle={{ width: 120}}
                        style={{backgroundColor: theme.colors.onSurface}}
                        open={open2}
                        value={reducedTicketNumber}
                        items={numbers}
                        setOpen={setOpen2}
                        setValue={setReducedTicketNumber}
                        setItems={setNumbers}
                        zIndex={2000}
                        zIndexInverse={2000}
                    />
                </View>
            </View>
            <FAB
                icon="send"
                label="Select seats"
                style={styles.fab}
                variant="tertiary"
                onPress={handleMoveToSeatsSelect}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Choose at least one ticket!</Text>
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
    }
});
