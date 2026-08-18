export function getPendingBills(billsData) {
    let totalPending = 0;

    billsData.forEach(bill => {
        if (bill.pending === true) {
            totalPending += bill.amount;
        }
    });
    return '$' +totalPending.toFixed(2);
}

export function getPaidBills(billsData){
    let totalPaid = 0;

    billsData.forEach(bill => {
        if (bill.pending === false) {
            totalPaid += bill.amount;
        }
    });

    return '$' + totalPaid.toFixed(2);
}

export function getCurrentBalance(transactionData, billsData, incomeData) {
    let totalIncome = 0;
    let totalBills = 0;
    let totalTransactions = 0;

    incomeData.forEach(income => {
      if (income.pending === false) {
        totalIncome += income.amount;
      }
    });

    billsData.forEach(bill => {
      if (bill.pending === false) {
        totalBills += bill.amount;
      }
    });

    transactionData.forEach(transaction => {
      if (transaction.pending === false) {
        totalTransactions += transaction.amount;
      }
    });

    const currentBalance = totalIncome - (totalBills + totalTransactions);
    return '$' + currentBalance.toFixed(2);
}

export function getPendingBalance(transactionData, billsData, incomeData) {
    let totalIncome = 0;
    let totalBills = 0;
    let totalTransactions = 0;

    incomeData.forEach(income => {
      if (income.pending === false) {
        totalIncome += income.amount;
      }
    });

        billsData.forEach(bill => {
        totalBills += bill.amount;
    });

    transactionData.forEach(transaction => {
        totalTransactions += transaction.amount;
    });

    const pendingBalance = totalIncome - (totalBills + totalTransactions);
    return '$' + pendingBalance.toFixed(2);
}

export function getSumByCategory(data, category) {
  let amount = 0;

  console.log('Calculating sum for category:', category);

  data.forEach(item => {
    if (item.category === category && item.pending === false) {
      amount += item.amount;
    }
  });
  return '$' + amount.toFixed(2);
}

export function getSumByType(data, type){
    let amount = 0;

    console.log('Calculating sum for type:', type);

    data.forEach(item => {
        if (item.type === type) {
            amount += item.amount;
        }
    });
    return '$' + amount.toFixed(2);
}

// function to calculate the sum of amounts for each category and return it back to the summary tab
export function sumByCategory(data) {
  const totals = data.reduce((result, item) => {
    const category = item.category;
    const amount = Number(item.amount) || 0;

    result[category] = (result[category] || 0) + amount;

    return result;
  }, {});

  return Object.entries(totals).map(([category, amount], index) => ({
    id: index + 1,
    description: `Total ${category}`,
    category: category,
    amount: amount
  }));
}