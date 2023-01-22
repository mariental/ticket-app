import QRCode from 'react-native-qrcode-svg';

import { View, FlatList, StyleSheet } from 'react-native';
import React from "react";
import {Text, useTheme} from "react-native-paper"
import {auth, db} from '../firebaseConfig';
import {collection, getDocs, query, where} from "firebase/firestore";
import Ticket from "../components/Ticket";
import {TicketType} from "../types";


export default function TicketScreen({ navigation }: any) {

    const [tickets, setTickets] = React.useState<Array<TicketType>>([])

    const theme = useTheme()

    React.useEffect(() => {
        const user = auth.currentUser;
        const fetchTickets = async () => {
            const ticketsFromDb: Array<any> = [];
            const ticketRef = collection(db, 'ticket');
            const q = query(ticketRef, where("user", "==", user?.email));
            const docSnap = await getDocs(q);
            docSnap.forEach(doc => {
                ticketsFromDb.push({id: doc.id, ...doc.data()});
            })
            return ticketsFromDb as Array<TicketType>
        }
        fetchTickets().then((ticketsFromDb) => {
            setTickets(ticketsFromDb);
        })
    })

    return (
        <View style={{flex: 1, justifyContent: "center", backgroundColor: theme.colors.background}}>
            {
                tickets.length !== 0 ?
                    <FlatList
                        data={tickets}
                        renderItem={({item})  =>
                            <Ticket ticket={item}/>
                        }
                        keyExtractor={(item) => item.id}
                    /> :
                    <Text style={{textAlign: "center"}} variant="headlineLarge">You have no tickets!</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({

});

