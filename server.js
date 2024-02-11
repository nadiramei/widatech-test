const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000; // Define the port for your server

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'sql6.freesqldatabase.com', // Change this to your MySQL host
    user: 'sql6683322', // Change this to your MySQL username
    password: 'E2TSJqq7At', // Change this to your MySQL password
    database: 'sql6683322' // Change this to your MySQL database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM product_table', (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from product_table: ', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/invoice-creation', (req, res) => {
    // console.log(req.headers);
    // console.log(req.body);
    const { invoice, products, totalAmount } = req.body;

    // Extract invoice data
    const { invoiceDate, dueDate, customerName, salesName, notes, invoiceNumber } = invoice;

    // Insert invoice data into the database
    const insertInvoiceQuery = `
        INSERT INTO invoice_table (invoice_number, invoice_date, due_date, customer_name, sales_name, notes, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(insertInvoiceQuery, [invoiceNumber, invoiceDate, dueDate, customerName, salesName, notes, totalAmount], (error, results, fields) => {
        if (error) {
            console.error('Error inserting invoice data:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const invoiceId = results.insertId; // Get the auto-generated invoice_id

        // Insert product data into the database
        const insertProductQuery = `
            INSERT INTO invoice_products_table (quantity, product_id, invoice_id)
            VALUES ?
        `;

        // Prepare product data for bulk insert
        const productValues = products.map(product => [product.productQuantity, product.productId, invoiceId]);

        connection.query(insertProductQuery, [productValues], (error, results, fields) => {
            if (error) {
                console.error('Error inserting product data:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            // Respond with success message
            res.status(201).json({ message: 'Invoice created successfully' });
        });
    });
});

app.get('/api/get-invoices', (req, res) => {
    connection.query('SELECT * FROM invoice_table', (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from invoice_table: ', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


app.get('/api/data', (req, res) => {
    res.json({ message: 'API endpoint is working!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});