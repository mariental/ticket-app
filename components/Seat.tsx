import {View, Image, StyleSheet } from 'react-native';
import React from "react";
import Checkbox from "react-native-bouncy-checkbox";
import {SeatType} from "./CinemaHall";
import firebase from "firebase/compat";
import functions = firebase.functions;

export type propsType = {
    available: boolean;
    setSelectedSeats: Function;
    itemId: string;
}

export default function Seat({available, setSelectedSeats, itemId}: propsType) {

    const [checked, setChecked] = React.useState<boolean>(false);

    const handleCheck = () =>{
        setChecked(!checked);
        setSelectedSeats(itemId)
    }

    return (
        <>
            {available ?
                <Checkbox
                    isChecked={checked}
                    disableBuiltInState
                    onPress={handleCheck}
                    style={styles.seat}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 0}}
                    iconStyle={{borderRadius: 0}}
                    fillColor="rgb(39, 22, 36)"
                    unfillColor="rgb(238, 222, 231)"
                    size={30}
                /> :
                <Checkbox
                    isChecked={checked}
                    disabled
                    disableBuiltInState
                    onPress={handleCheck}
                    style={styles.seat}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 0}}
                    iconStyle={{borderRadius: 0}}
                    fillColor="rgb(39, 22, 36)"
                    unfillColor="rgb(39, 22, 36)"
                    size={30}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    seat: {
        margin: 3
    }
});
