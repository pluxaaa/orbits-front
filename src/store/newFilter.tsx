import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface Orbit {
    ID: number,
    Name: string,
    IsAvailable: boolean,
    Apogee: string,
    Perigee: string,
    Inclination: string,
    Description: string,
    ImageURL: string
}

interface User {
    UUID: string,
    Name: string,
    Role: number,
    Pass: string
}

interface TransferRequest {
    ID: number,
    ClientRefer?: string,
    Client?: User,
    ModerRefer?: string,
    Moder?: User,
    Status: string,
    DateCreated?: string,
    DateProcessed?: string,
    DateFinished?: string,
}

interface DataState {
    orbit: Orbit[];
    orbName?: string;
    orbApo?: string;
    orbPeri?: string;
    orbIncl?: string;
    orbCircle?: string;
    request: TransferRequest[];
    requestID?: number | null;
    reqStatus?: string;
    reqStart?: string;
    reqEnd?: string;
    reqClient?: string;
}

const initialState: DataState = {
    requestID: null,
    orbName: undefined || "",
    orbApo: undefined || "",
    orbPeri: undefined || "",
    orbIncl: undefined || "",
    orbCircle: undefined || "",
    reqStatus: undefined || "",
    reqStart: undefined || "",
    reqEnd: undefined || "",
    reqClient: undefined || "",
    request: [],
    orbit: [],
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setOrbit(state, action: PayloadAction<Orbit[]>) {
            state.orbit = action.payload
        },
        setOrbName(state, action: PayloadAction<string>) {
            state.orbName = action.payload;
        },
        setOrbApo(state, action: PayloadAction<string>) {
            state.orbApo = action.payload;
        },
        setOrbPeri(state, action: PayloadAction<string>) {
            state.orbPeri = action.payload;
        },
        setOrbIncl(state, action: PayloadAction<string>) {
            state.orbIncl = action.payload;
        },
        setOrbCircle(state, action: PayloadAction<string>) {
            state.orbCircle = action.payload;
        },
        setRequest(state, action: PayloadAction<TransferRequest[]>) {
            state.request = action.payload;
        },
        setRequestID(state, action: PayloadAction<number | null | undefined>) {
            state.requestID = action.payload;
        },
        setReqStatus(state, action: PayloadAction<string>) {
            state.reqStatus = action.payload;
        },
        setReqStart(state, action: PayloadAction<string>) {
            state.reqStart = action.payload;
        },
        setReqEnd(state, action: PayloadAction<string>) {
            state.reqEnd = action.payload;
        },
        setReqClientSl(state, action: PayloadAction<string>) {
            state.reqClient = action.payload;
        },
    }
});

export const {
    setOrbit,
    setOrbName,
    setOrbApo,
    setOrbPeri,
    setOrbIncl,
    setOrbCircle,
    setRequest,
    setRequestID,
    setReqStatus,
    setReqStart,
    setReqEnd,
    setReqClientSl,
} = dataSlice.actions;

export default dataSlice.reducer;

export const useOrbit = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbit);

export const useOrbName = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbName);

export const useOrbApo = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbApo);

export const useOrbPeri = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbPeri);

export const useOrbIncl = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbIncl);

export const useOrbCircle = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.orbCircle);

export const useRequest = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.request);

export const useRequestID = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.requestID);

export const useReqStatus = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.reqStatus);

export const useReqStart = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.reqStart);

export const useReqEnd = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.reqEnd);

export const useReqClient = () =>
    useSelector((state: { newFilter: DataState }) => state.newFilter.reqClient);
