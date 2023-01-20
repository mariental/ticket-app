import {DocumentReference} from "firebase/firestore";

export type MovieType = {
    id: string;
    title: string;
    image: string;
    premiere: string;
    cast: string;
    synopsis: string;
    director: string;
    duration: string;
    genre: string;
    age_limit: string;
    language: string;
    production: string;
}
export type SeanceType= {
    id: string;
    time: string;
    date: string;
    movie: DocumentReference;
    hall: DocumentReference;
}
export type CinemaType= {
    id: string;
    name: string;
    address: string;
}
export type HallType= {
    id: string;
    cinema: DocumentReference;
}
export type SeatType = {
    id: string;
    available: boolean;
    row: number;
    number: number;
}
