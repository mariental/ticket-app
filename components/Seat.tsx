import {View, Image, StyleSheet } from 'react-native';
import React from "react";
import Checkbox from "react-native-bouncy-checkbox";
import firebase from "firebase/compat";
import {useTheme} from "react-native-paper";
import {SeanceSeatType} from "../types";
import {useAppSelector} from "../hooks";

export type propsType = {
    available: boolean;
    setSelectedSeats: Function;
    item: SeanceSeatType;
    quantity: number;
    showDialog: Function
}

export default function Seat({available, setSelectedSeats, item, quantity, showDialog}: propsType) {

    const theme = useTheme()

    const [checked, setChecked] = React.useState<boolean>(false);
    const normalTickets = useAppSelector(state => state.booking.normalTickets)
    const reducedTickets = useAppSelector(state => state.booking.reducedTickets)

    const handleCheck = () =>{
        if(checked){
            setChecked(!checked)
            setSelectedSeats(item)
        }
        if(!checked){
            if((normalTickets + reducedTickets) === quantity){
                showDialog()
            }
            else {
                setChecked(!checked)
                setSelectedSeats(item)
            }
        }
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
                    fillColor={theme.colors.primaryContainer}
                    unfillColor={theme.colors.primary}
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
                    fillColor={theme.colors.primaryContainer}
                    unfillColor={theme.colors.primary}
                    size={30}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    seat: {
        margin: 10,
    }
});
