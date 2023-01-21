import {View, StyleSheet, FlatList} from 'react-native';
import React from "react";
import {MovieType, SeanceType} from "../types";
import {Chip, Text, Button, Dialog, Portal, useTheme} from "react-native-paper"
import {useAppDispatch} from "../hooks";
import {setMovie, setSeance} from "../features/booking/bookingSlice";
import {auth} from "../firebaseConfig";
import {User} from "firebase/auth";


type PropsType = {
    seances: Array<SeanceType>;
    navigation: any;
    movie: MovieType;
}

export default function MovieSeance(props: PropsType) {

    const theme = useTheme()

    const [selectedSeance, setSelectedSeance] = React.useState<SeanceType>()
    const [visible, setVisible] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<User | null>(null)

    const dispatch = useAppDispatch()

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
        const user = auth.currentUser;
        if(user){
            setUser(user)
        }
        showDialog()
    }

    const handleClose = (): void => {
        if(user){
            const seance = {
                id: selectedSeance?.id,
                time: selectedSeance?.time,
                date: selectedSeance?.date
            }
            dispatch(setSeance(seance))
            dispatch(setMovie(props.movie))
            setSelectedSeance(undefined)
            hideDialog()
            props.navigation.navigate('TicketReservation', { seanceId: selectedSeance?.id})
        }
        else{
            hideDialog()
            props.navigation.navigate('Login')
        }
    }

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <View style={{marginBottom: 20}}>
            <FlatList
                numColumns={4}
                data={props.seances}
                renderItem={({item}) =>
                    <Chip
                        style={[styles.chip ,{ backgroundColor: theme.colors.tertiaryContainer}]}
                        textStyle={{color: theme.colors.onTertiaryContainer}}
                        mode="flat"
                        onPress={() => handlePress(item)}>
                        {item.time}
                    </Chip>}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                        { user !== null ?
                            <Text variant="bodyMedium">Do you want to proceed to the booking process?</Text> :
                            <Text variant="bodyMedium">You must be logged in to book a ticket. Do you want to go to the login page?</Text>
                        }
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
