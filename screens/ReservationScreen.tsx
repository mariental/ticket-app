import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, Snackbar} from 'react-native-paper';
import React from "react";
import Seat from "../components/Seat";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {MovieType, SeanceType, SeatType} from "../types";
import {db} from "../firebaseConfig";
import DropDownPicker from 'react-native-dropdown-picker';

export type TicketType = {
    id: string;
    type: string;
    price: number;
}

export default function ReservationScreen({ route, navigation }: any) {

    const { seanceId } = route.params;

    const [normalTicketNumber, setNormalTicketNumber] = React.useState<number>(1)
    const [reducedTicketNumber, setReducedTicketNumber] = React.useState<number>(1)

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [numbers, setNumbers] = React.useState([
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4}]
    );


    return (
        <View style={{ flex: 1, padding: 10}}>
            <Text style={{textAlign: "center"}} variant={"headlineLarge"}>Black Panther: Wakanda Forever</Text>
            <Text style={{textAlign: "center", marginVertical: 20}} variant={"bodyLarge"}>Choose tickets number</Text>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginVertical: 20}}>
                <Text variant={"titleMedium"}>normal</Text>
                <DropDownPicker
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
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginVertical: 20}}>
                <Text variant={"titleMedium"}>reduced</Text>
                <DropDownPicker
                    containerStyle={{ width: 120}}
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
            <FAB
                icon="send"
                label="Select seats"
                style={styles.fab}
                onPress={() => navigation.navigate('CinemaHall', { seanceId: seanceId })}
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
