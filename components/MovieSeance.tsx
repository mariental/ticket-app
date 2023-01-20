import {View, StyleSheet, FlatList} from 'react-native';
import React from "react";
import {SeanceType} from "../types";
import {Chip, Text, Button, Dialog, Portal } from "react-native-paper"


type PropsType = {
    seances: Array<SeanceType>;
    navigation: any;
}

export default function MovieSeance(props: PropsType) {

    const [selectedSeance, setSelectedSeance] = React.useState<SeanceType>()
    const [visible, setVisible] = React.useState<boolean>(false);

    const isSelectedSeance= (chipSeanceId: string) => {
        if(selectedSeance !== undefined){
            showDialog()
            return chipSeanceId === selectedSeance.id
        }
        else
            return false
    }

    const handlePress = (item: SeanceType): void => {
        setSelectedSeance(item)
        showDialog()
    }

    const handleClose = (): void => {
        setSelectedSeance(undefined)
        hideDialog()
        props.navigation.navigate('Reservation', { seanceId: selectedSeance?.id})
    }

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <View style={{marginBottom: 20}}>
            <FlatList
                numColumns={4}
                data={props.seances}
                renderItem={({item}) => <Chip style={styles.chip} onPress={() => handlePress(item)}>{item.time}</Chip> }
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Czy chcesz przejść do rezerwacji?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => hideDialog()}>Cancel</Button>
                        <Button onPress={handleClose}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        marginHorizontal: 10
    }
});
