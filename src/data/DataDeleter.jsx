import { generateTraceId } from '../util/TraceIdGenerater.jsx';

async function deleteTransaction(index, currentTab, onSuccessCallBack = null) {
    console.log('Deleting transaction:', index.values().next().value);
    let endpoint = "";

    switch (currentTab) {
        case 0:
            endpoint = "transactions";
            break;
        case 1:
            endpoint = "bills";
            break;
        case 2:
            endpoint = "incomes";
            break;
        default:
            console.error('Unknown tab index:', currentTab);
            return;
    }

    const response = await fetch('http://localhost:8080/v1/' + endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'traceId': generateTraceId(),
            "id": index.values().next().value
        },
        credentials: 'include'
    });

    if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (onSuccessCallBack) {
        await onSuccessCallBack();
    }


    return response.json();
}

export default deleteTransaction;
