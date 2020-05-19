import React, { useState, createContext, useRef } from 'react';
import { ServerProxy } from '../components/ServerProxy';

export const AuthContext = createContext([{}, () => {}, {}]);

export function AuthContextProvider(props){
    const [userData, setUserData] = useState({
        username: null,
        token: null
    })
    const server = useRef(new ServerProxy(setUserData));

    return(
        <AuthContext.Provider value={[userData, server.current]}>
            {props.children}
        </AuthContext.Provider>
    )
}
