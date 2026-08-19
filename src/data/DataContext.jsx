import { createContext, useState, useContext, useEffect } from 'react';
import { generateTraceId } from '../util/TraceIdGenerater.jsx';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [feedRows, setFeedRows] = useState([]);

    const refreshAllData = async () => {
        try {
            console.log('Fetching feed data from Spring Boot backend...');
            const [feedRes] = await Promise.all([
                fetch('http://localhost:8080/v1/feed', {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceId': generateTraceId()
                    },
                    credentials: 'include', // Include credentials for session management
                })
            ]);

            setFeedRows(await feedRes.json());
        } catch {
            console.error('Error refreshing data');
        }
    };

    useEffect(() => {refreshAllData();}, []);

    return (
        <DataContext.Provider value={{ feedRows, refreshAllData, setFeedRows }}>
            {children}
        </DataContext.Provider>
    );
}

export const useGlobalData = () => useContext(DataContext);