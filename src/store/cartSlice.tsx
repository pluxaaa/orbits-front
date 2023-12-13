import { createSlice } from "@reduxjs/toolkit"

const orbits = localStorage.getItem('orbits')
    ? localStorage.getItem('orbits')?.split(',')
    : [];

const initialState = {
    orbits,
    added: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addOrbit(state, {payload}) {
            if (state.orbits == null) {
                state.orbits = []
            }

            if (state.orbits.indexOf(payload.toString()) === -1) {
                state.orbits.push(payload.toString())
                localStorage.setItem('orbits', state.orbits.toString())
            }
            state.added = true
            
        },
        removeOrbit(state, {payload}) {
            if (state.orbits == null) {
                state.orbits = []
            }

            if (state.orbits.length == 0) {
                return
            }
            
            const orbitIndex = state.orbits.indexOf(payload.toString())
            if (orbitIndex > -1) {
                state.orbits.splice(orbitIndex, 1)
                localStorage.setItem('orbits', state.orbits.toString())
            }
        },
        disableAdded(state) {
            state.added = false
        }
    }
})

export default cartSlice