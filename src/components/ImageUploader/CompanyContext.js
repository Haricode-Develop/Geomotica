import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import logoDefault from '../assets/img/logo_letra.png';
import { useAuth } from './AuthContext';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const { userData } = useAuth();
    const [logo, setLogo] = useState(logoDefault);

    useEffect(() => {
        const fetchLogo = async () => {
            if (userData?.ID_USUARIO) {
                try {
                    const response = await axios.get(`${API_BASE_URL}configuration/logoEmpresa/${userData.ID_USUARIO}`, {
                        responseType: 'blob'
                    });

                    if (response.data.size > 0) {
                        const logoUrl = URL.createObjectURL(response.data);
                        setLogo(logoUrl);
                    } else {
                        setLogo(logoDefault);
                    }
                } catch (error) {
                    console.error('Error al obtener el logo de la empresa:', error);
                    setLogo(logoDefault);
                }
            }
        };

        fetchLogo();
    }, [userData]);

    return (
        <CompanyContext.Provider value={{ logo, setLogo }}>
            {children}
        </CompanyContext.Provider>
    );
};
