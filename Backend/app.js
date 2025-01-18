const express = require('express');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const addExpense = require('./routes/addExpense')
const addMoney = require('./routes/addMoney')
const view = require('./routes/view')
const cors = require('cors');
const port =5500;


const corsOptions = {
    origin: ' http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const app = express();
app.use(cors(corsOptions)); 
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/',addMoney)
app.use('/',view)

app.use('/',addExpense)


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});