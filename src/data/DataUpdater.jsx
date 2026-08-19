import { generateTraceId } from '../util/TraceIdGenerater.jsx';

async function patchTransaction(draftRow, currentTab, onSuccessCallBack = null) {
    console.log('Posting transaction:', draftRow);
    draftRow.accountId = '2038010339';
    let endpoint = "";

    switch (currentTab) {
        case 0:
            draftRow.type = 'transaction';
            endpoint = "transactions";
            break;
        case 1:
            draftRow.type = 'bill';
            endpoint = "bills";
            break;
        case 2:
            draftRow.type = 'income';
            endpoint = "incomes";
            break;
        default:
            console.error('Unknown tab index:', currentTab);
            return;
    }

    console.log('Draft row after adding accountId and type:', draftRow);

    const response = await fetch('http://localhost:8080/v1/' + endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'traceId': generateTraceId()
        },
        credentials: 'include',
        body: JSON.stringify([draftRow])
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

export default patchTransaction;
