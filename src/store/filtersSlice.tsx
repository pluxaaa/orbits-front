import { createSlice } from "@reduxjs/toolkit";

const orbitIsCircle = localStorage.getItem('orbitIsCircle')
    ? localStorage.getItem('orbitIsCircle')
    : '';

const orbitIncl = localStorage.getItem('orbitIncl')
    ? localStorage.getItem('orbitIncl')
    : '';

const orbitName = localStorage.getItem('orbitName')
    ? localStorage.getItem('orbitName')
    : '';
const requestStatus = localStorage.getItem('requestStatus')
    ? localStorage.getItem('requestStatus')
    : '';

const initialState = {
    orbitIsCircle,
    orbitIncl,
    orbitName,
    requestStatus,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setOrbitIsCircle(state, {payload}) {
            state.orbitIsCircle = payload
            localStorage.setItem('orbitIsCircle', payload)
        },
        setOrbitIncl(state, {payload}) {
            state.orbitIncl = payload
            localStorage.setItem('OrbitIncl', payload)
        },
        setOrbitName(state, {payload}) {
            state.orbitName = payload
            localStorage.setItem('orbitName', payload)
        },
        setRequestStatus(state, {payload}) {
            state.requestStatus = payload
            localStorage.setItem('requestStatus', payload)
        }
    }
})

export default filtersSlice