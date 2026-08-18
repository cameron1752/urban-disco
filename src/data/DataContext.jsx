import { createContext, useState, useContext, useEffect } from 'react';
import { generateTraceId } from '../util/TraceIdGenerater.jsx';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [transactionRows, setTransactionRows] = useState([]);
    const [billsRows, setBillsRows] = useState([]);
    const [incomeRows, setIncomeRows] = useState([]);

    const refreshAllData = async () => {
        try {
            console.log('Fetching financial data from Spring Boot backend...');
            const [txRes, billsRes, incRes] = await Promise.all([
                fetch('http://localhost:8080/v1/transactions', {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceId': generateTraceId()
                    },
                    credentials: 'include', // Include credentials for session management
                }),
                fetch('http://localhost:8080/v1/bills', {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceId': generateTraceId()
                    },
                    credentials: 'include',
                }),fetch('http://localhost:8080/v1/incomes', {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceId': generateTraceId()
                    },
                    credentials: 'include',
                })
            ]);

            setTransactionRows(await txRes.json());
            setBillsRows(await billsRes.json());
            setIncomeRows(await incRes.json());
        } catch {
            console.error('Error refreshing data');
        }
    };

    useEffect(() => {refreshAllData();}, []);

    return (
        <DataContext.Provider value={{ transactionRows, billsRows, incomeRows, refreshAllData, setTransactionRows, setBillsRows, setIncomeRows }}>
            {children}
        </DataContext.Provider>
    );
}

export const useGlobalData = () => useContext(DataContext);