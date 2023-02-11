import QRCode from 'react-native-qrcode-svg';

import { View, StyleSheet } from 'react-native';
import React from "react";

import {Divider, Text, useTheme} from "react-native-paper";
import {CinemaType, HallType, MovieType, SeanceType, TicketType} from "../types";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";

interface PropsType {
    ticket: TicketType;
}


export default function Ticket(props: PropsType) {

    const theme = useTheme()

    const [seance, setSeance] = React.useState<SeanceType>()
    const [hall, setHall] = React.useState<HallType>()
    const [cinema, setCinema] = React.useState<CinemaType>()
    const [movie, setMovie] = React.useState<MovieType>()


    React.useEffect(() => {
        const fetchSeance = async () => {
            const seanceRef = doc(db, 'seance', props.ticket.seance.id);
            const docSnap = await getDoc(seanceRef);
            return docSnap.data() as SeanceType
        }
        fetchSeance().then((seanceFromDb) => {
            if(seanceFromDb) {
                setSeance(seanceFromDb)
            }
        })
    }, [])

    React.useEffect(() => {
        const fetchHall = async (id: string) => {
            const hallRef = doc(db, 'hall', id);
            const docSnap = await getDoc(hallRef);
            return docSnap.data() as HallType
        }
        if(seance !== undefined){
            fetchHall(seance.hall.id).then((hallFromDb) => {
                if(hallFromDb) {
                    setHall(hallFromDb)
                }
            })
        }
    }, [seance])

    React.useEffect(() => {
        const fetchCinema = async (id: string) => {
            const cinemaRef = doc(db, 'cinema', id);
            const docSnap = await getDoc(cinemaRef);
            return docSnap.data() as CinemaType
        }
        if(hall !== undefined){
            fetchCinema(hall.cinema.id).then((cinemaFromDb) => {
                if(cinemaFromDb) {
                    setCinema(cinemaFromDb)
                }
            })
        }
    }, [seance, hall])

    React.useEffect(() => {
        const fetchData = async (id: string) => {
            const docRef = doc(db, 'movie', id);
            const docSnap = await getDoc(docRef);
            return docSnap.data() as MovieType
        }
        if(seance !== undefined){
            fetchData(seance.movie.id).then((movieFromDb) => {
                setMovie(movieFromDb);
            })
        }
    }, [seance])

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View style={[styles.transparent, {backgroundColor: theme.colors.secondaryContainer,  borderStyle: "solid", borderColor: theme.colors.secondary, borderWidth: 1}]}>
                <Text variant={"titleLarge"}>{movie?.title}</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <View style={{flexDirection: "column", marginVertical: 10}}>
                            <Text variant={"titleSmall"}>Date</Text>
                            <Text variant={"bodySmall"}>{seance?.date}.2023</Text>
                        </View>
                        <View style={{flexDirection: "column", marginVertical: 10}}>
                            <Text variant={"titleSmall"}>Seat</Text>
                            <Text variant={"bodySmall"}>{props.ticket.seats.map((seat) => seat + ', ')}</Text>
                        </View>
                        <View style={{flexDirection: "column", marginVertical: 10}}>
                            <Text variant={"titleSmall"}>Price</Text>
                            <Text variant={"bodySmall"}>{props.ticket.price}</Text>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <View style={{flexDirection: "column", marginVertical: 10}}>
                            <Text variant={"titleSmall"}>Time</Text>
                            <Text variant={"bodySmall"}>{seance?.time}</Text>
                        </View>
                        <View style={{flexDirection: "column", marginVertical: 10}}>
                            <Text variant={"titleSmall"}>Cinema</Text>
                            <Text variant={"bodySmall"}>{cinema?.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.qr, { borderStyle: "solid", borderColor: theme.colors.secondary, borderWidth: 1}]}>
                <QRCode
                    value={props.ticket.id}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 50,
        paddingVertical: 40,
    },
    transparent: {
        padding: 30,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10
    },
    qr: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    column: {
        flexDirection: "column",
        justifyContent: "flex-start",
    }
});

