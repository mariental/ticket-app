import { configureStore } from '@reduxjs/toolkit'
import booking from './features/booking/bookingSlice'

const store = configureStore({
    reducer: {
        booking: booking
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
