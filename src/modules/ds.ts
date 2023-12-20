export interface Orbit {
    ID: number,
    Name: string,
    IsAvailable: boolean,
    Apogee: string,
    Perigee: string,
    Inclination: string,
    Description: string,
    ImageURL: string
}

export interface User {
    UUID: string,
    Name: string,
    Role: number,
    Pass: string
}

export interface TransferRequest {
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