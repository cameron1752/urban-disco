import { useState, useEffect } from 'react'
import './App.css'
import MenuAppBar from './components/MenuAppBar.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useGlobalData, DataProvider } from './data/DataContext.jsx';
import QwikCard from './components/QwikCard.jsx';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import QwikDataGrid from './components/QwikDataGrid.jsx';
import { getCurrentBalance, getPendingBalance, getPendingBills, getPaidBills, getSumByType, sumByCategory } from './util/HelperFunctions.jsx';
import Landing from './landing.jsx';

const theme = createTheme({
  palette: {
    text: { primary: '#ffffff' },
  },
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const columns = [
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'category', headerName: 'Category', width: 165 },
  { field: 'amount', headerName: 'Amount', width: 165 },
  { field: 'date', headerName: 'Date', width: 165 },
  { field: 'pending', headerName: 'Pending', width: 130 },
]

const summaryColumns = [
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'category', headerName: 'Category', width: 165 },
  { field: 'amount', headerName: 'Amount', width: 165 },
]

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

function Innards() {
  const [value, setValue] = useState(0)
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowBills, setSelectedBillRows] = useState([]);
  const [selectedRowIncome, setSelectedIncomeRows] = useState([]);

  const { transactionRows, billsRows, incomeRows } = useGlobalData();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const cards = [
    { id: 1, title: 'Current Balance', description: getCurrentBalance(transactionRows, billsRows, incomeRows) },
    { id: 2, title: 'Pending Balance', description: getPendingBalance(transactionRows, billsRows, incomeRows) },
    { id: 3, title: 'Bills Remaining', description: getPendingBills(billsRows) },
    { id: 4, title: 'Bills Paid', description: getPaidBills(billsRows) },
    { id: 5, title: 'Total Income', description: getSumByType(incomeRows, 'income') },
    { id: 6, title: 'Total Bills', description: getSumByType(billsRows, 'bill') },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="lg">
          <MenuAppBar />
          <Grid container spacing={2} sx={{ padding: 3 }}>
            {cards.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 2 }} sx={{ display: 'flex' }}>
                <QwikCard title={item.title} body={item.description} />
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ padding: 3 }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
              '& .MuiTab-root': { color: 'white' },
              '& .Mui-selected': { color: 'light-blue' },
            }}>
              <Tab label="Transactions" {...a11yProps(0)} />
              <Tab label="Bills" {...a11yProps(1)} />
              <Tab label="Income" {...a11yProps(2)} />
              <Tab label="Summary" {...a11yProps(3)} />
            </Tabs>

            {/* Tab 0: Transactions */}
            <TabPanel value={value} index={0}>
              <Grid container spacing={2} sx={{ padding: 3 }}>
                <Grid key={2} size={{ xs: 36, sm: 18, md: 12 }} sx={{ display: 'flex' }}>
                  {(
                    <QwikDataGrid rows={transactionRows} columns={columns} onSelectionChange={setSelectedRows} currentTab={value} />
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 1: Bills */}
            <TabPanel value={value} index={1}>
              <Grid container spacing={2} sx={{ padding: 3 }}>
                <Grid key={2} size={{ xs: 36, sm: 18, md: 12 }} sx={{ display: 'flex' }}>
                  <Box sx={{ width: '100%', height: 400 }}>
                    {(
                      <QwikDataGrid rows={billsRows} columns={columns} onSelectionChange={setSelectedBillRows} currentTab={value} />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Income */}
            <TabPanel value={value} index={2}>
              <Grid container spacing={2} sx={{ padding: 3 }}>
                <Grid key={2} size={{ xs: 36, sm: 18, md: 12 }} sx={{ display: 'flex' }}>
                  {(
                    <QwikDataGrid rows={incomeRows} columns={columns} onSelectionChange={setSelectedIncomeRows} currentTab={value} />
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 3: Summary */}
            <TabPanel value={value} index={3}>
              <Grid container spacing={2} sx={{ padding: 3 }}>
                <Grid key={2} size={{ xs: 36, sm: 18, md: 12 }} sx={{ display: 'flex' }}>
                  {(
                    <QwikDataGrid rows={sumByCategory(transactionRows)} columns={summaryColumns} onSelectionChange={setSelectedIncomeRows} currentTab={value} />
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

function App() {
  const [user, setUser] = useState(null);

useEffect(() => {
  fetch("http://localhost:8080/api/me", {
    credentials: "include"
  })
    .then(response => {
      console.log("Response status:", response.status);
      console.log("Content-Type:", response.headers.get("content-type"));

      if (!response.ok) {
        throw new Error("Not logged in");
      }

      return response.text();
    })
    .then(text => {
      console.log("Raw response:", text);

      const data = JSON.parse(text);
      console.log("User object:", data);

      setUser(data);
    })
    .catch(error => {
      console.error("Auth error:", error);
      setUser(null);
    });
}, []);

  if (!user) {
    console.log("User is not logged in");
    return (
      <Landing />
    );
  }

  return (
    <DataProvider>
      <Innards />
    </DataProvider>
  );
}

export default App
