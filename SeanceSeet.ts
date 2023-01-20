import { db } from './firebaseConfig';
import {writeBatch, doc, collection, DocumentReference, getDocs, WriteBatch, query, where} from 'firebase/firestore'
import React from "react";
import {BatchRequestClient} from "firebase-admin/lib/messaging/batch-request-internal";
import {CinemaType, HallType, SeanceType, SeatType} from "./types";

export type SeanceSeatType = {
    seance: DocumentReference;
    seat: DocumentReference;
    available: boolean;
}

export type SeatInHall = {
    hall: HallType;
    seats: Array<SeatType>;
}

const batchArray: Array<WriteBatch> = [];
batchArray.push(writeBatch(db));

let operationCounter = 0;
let batchIndex = 0;

const seanceSeat : Array<SeanceSeatType> = []
const seances : Array<SeanceType> = []
let seats : Array<SeatType> = []
const halls : Array<HallType> = []
const seatsInHall: Array<SeatInHall> = []

const fetchSeances = async () => {
    const seancesFromDb: Array<any> = [];
    const seanceRef = collection(db, 'seance');
    const docSnap = await getDocs(seanceRef);
    docSnap.forEach(doc => {
        seancesFromDb.push({id: doc.id, ...doc.data()});
    })
    return seancesFromDb as Array<SeanceType>
}

const fetchHall = async () => {
    const hallsFromDb: Array<any> = [];
    const docSnap = await getDocs(collection(db, 'hall'));
    docSnap.forEach(doc => {
        hallsFromDb.push({id: doc.id, ...doc.data()});
    })
    return hallsFromDb as Array<HallType>
}

const fetchSeats = async (hall: HallType) => {
    const seatsFromDb: Array<any> = [];
    const seatRef = collection(db, 'seat');
    const hallRef = doc(db,'hall', hall.id)
    const q = query(seatRef, where('hall', '==', hallRef));
    const docSnap = await getDocs(q);
    docSnap.forEach(doc => {
        seatsFromDb.push({id: doc.id, ...doc.data()});
    })
    return seatsFromDb as Array<SeatType>
}

export default async function SeanceSeatSeed() {

    await fetchSeances().then((seancesFromDb) => {
        seancesFromDb.forEach((seance) => {
            seances.push(seance)
        })
    })

    await fetchHall().then((hallsFromDb) => {
        hallsFromDb.forEach((hall) => {
            halls.push(hall)
        })
    })

    for (const hall of halls) {
        await fetchSeats(hall).then((seatsFromDb) => {
            seatsFromDb.forEach((seat) => {
                seats.push(seat)
            })
        })
        let tmp: Array<SeatType> = []
        seats.forEach((seat) => {
            tmp.push(seat)
        })
        seatsInHall.push({hall: hall, seats: tmp})
        tmp = []
        seats = []
    }

    for(let i=0; i<seances.length; i++){
        let tmp: Array<SeanceSeatType> = []
        const hall = seatsInHall.find((item) => item.hall.id == seances[i].hall.id)
        if(hall != undefined){
            for(let j=0; j<hall.seats.length; j++){
                seanceSeat.push({
                    seance: doc(db, 'seance', seances[i].id),
                    seat: doc(db, 'seat', hall.seats[j].id),
                    available: true
                })
            }
        }
        seanceSeat.push.apply(seanceSeat, tmp)
        tmp = []
    }

    console.log('seance seat', seanceSeat.length)


    seanceSeat.forEach((seanceSeat) => {
        batchArray[batchIndex].set(doc(collection(db, 'seanceSeat')), seanceSeat);
        operationCounter++;

        if (operationCounter === 499) {
            batchArray.push(writeBatch(db))
            batchIndex++;
            operationCounter = 0;
        }
    })

    for (const batch of batchArray) {
        await batch.commit()
            .then(() => {
                console.log('success')
            })
            .catch((error) => {
                console.log(error)
            })
    }

}


