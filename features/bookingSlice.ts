import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import {MovieType, SeanceType} from "../types";

interface Seat {
    id: string;
    number: number;
}

interface BookingState {
    movie: MovieType | null;
    seance: Partial<SeanceType> | null;
    normalTickets: number;
    reducedTickets: number;
    seats: Array<Seat>;
}

const initialState: BookingState = {
    movie: null,
    seance: null,
    normalTickets: 0,
    reducedTickets: 0,
    seats: []
}

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setMovie(state, action: PayloadAction<MovieType>){
            state.movie = action.payload
        },
        setSeance(state, action: PayloadAction<Partial<SeanceType>>){
            state.seance = action.payload
        },
        setTickets(state, action: PayloadAction<{ normalTickets: number, reducedTickets: number }>){
            state.normalTickets = action.payload.normalTickets
            state.reducedTickets = action.payload.reducedTickets
        },
        setBookedSeats(state, action: PayloadAction<Array<Seat>>){
            state.seats = action.payload
        },
        clearBooking(state){
            state = initialState
        }
    },
})

export const { setMovie, setSeance, setTickets, setBookedSeats, clearBooking } = bookingSlice.actions

export const selectBooking = (state: RootState) => state.booking

export default bookingSlice.reducer
