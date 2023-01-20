import {View, Image, StyleSheet, ScrollView, StatusBar, FlatList} from 'react-native';
import {Button, TextInput, Text, FAB, Snackbar} from 'react-native-paper';
import React from "react";

export type TicketType = {
    id: string;
    type: string;
    price: number;
}

export default function OrderScreen({ route, navigation }: any) {

    const { seanceId } = route.params;


    return (
        <View style={{ flex: 1, padding: 10}}>
            <Text style={{textAlign: "center"}} variant={"headlineLarge"}>Your order</Text>
            <Text variant={"bodyLarge"}>Black Panther: Wakanda Forever</Text>

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
