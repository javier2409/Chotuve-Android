import React, { useState, createContext, useRef } from 'react';
import { ServerProxy } from '../components/ServerProxy';

export const AuthContext = createContext([{}, () => {}, {}]);

export function AuthContextProvider(props){
    const [userData, setUserData] = useState({
        username: null,
        token: null
    });

    function dataAccess(){
        return userData
    }

    const [server, _] = useState(new ServerProxy(dataAccess, setUserData));

    return(
        <AuthContext.Provider value={[userData, setUserData, server]}>
            {props.children}
        </AuthContext.Provider>
    )
}
