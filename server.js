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
    const { invoice, products, totalAmount } = req.body;

    // Extract invoice data
    const { invoiceDate, dueDate, customerName, salesName, notes, invoiceNumber } = invoice;

    // Start a transaction
    connection.beginTransaction(error => {
        if (error) {
            console.error('Error starting transaction:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Prepare product update queries
        const updateProductStockPromises = products.map(product => {
            return new Promise((resolve, reject) => {
                const { productId, productQuantity } = product;
                connection.query('SELECT stock FROM product_table WHERE id = ?', [productId], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const currentStock = results[0].stock;
                    const updatedStock = currentStock - productQuantity;
                    connection.query('UPDATE product_table SET stock = ? WHERE id = ?', [updatedStock, productId], (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    });
                });
            });
        });

        // Execute all product update queries in parallel
        Promise.all(updateProductStockPromises)
            .then(() => {
                // Insert invoice data into the database
                const insertInvoiceQuery = `
                    INSERT INTO invoice_table (invoice_number, invoice_date, due_date, customer_name, sales_name, notes, amount)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                connection.query(insertInvoiceQuery, [invoiceNumber, invoiceDate, dueDate, customerName, salesName, notes, totalAmount], (error, results) => {
                    if (error) {
                        connection.rollback(() => {
                            console.error('Error inserting invoice data:', error);
                            res.status(500).json({ error: 'Internal server error' });
                        });
                        return;
                    }

                    const invoiceId = results.insertId;

                    // Prepare product data for bulk insert
                    const productValues = products.map(product => [product.productQuantity, product.productId, invoiceId]);

                    // Insert product data into the database
                    const insertProductQuery = `
                        INSERT INTO invoice_products_table (quantity, product_id, invoice_id)
                        VALUES ?
                    `;

                    connection.query(insertProductQuery, [productValues], (error, results) => {
                        if (error) {
                            connection.rollback(() => {
                                console.error('Error inserting product data:', error);
                                res.status(500).json({ error: 'Internal server error' });
                            });
                            return;
                        }

                        // Commit the transaction
                        connection.commit(error => {
                            if (error) {
                                connection.rollback(() => {
                                    console.error('Error committing transaction:', error);
                                    res.status(500).json({ error: 'Internal server error' });
                                });
                                return;
                            }

                            // Respond with success message
                            res.status(201).json({ message: 'Invoice created successfully' });
                        });
                    });
                });
            })
            .catch(error => {
                connection.rollback(() => {
                    console.error('Error updating product stock:', error);
                    res.status(500).json({ error: 'Internal server error' });
                });
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

app.post('/api/get-invoice-products', (req, res) => {
    const { id } = req.body;

    const getInvoiceProductsQuery = `
        SELECT ip.quantity, p.product_name, p.price
        FROM invoice_products_table ip
        INNER JOIN product_table p ON ip.product_id = p.id
        WHERE ip.invoice_id = ?
    `;

    connection.query(getInvoiceProductsQuery, [id], (error, results) => {
        if (error) {
            console.error('Error fetching invoice products:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

app.delete('/api/delete-invoice', (req, res) => {
    const { id } = req.body;

    // Check if the ID is provided in the request body
    if (!id) {
        return res.status(400).json({ error: 'Invoice ID is required' });
    }

    // SQL query to delete data from invoice_products_table
    const deleteProductsQuery = 'DELETE FROM invoice_products_table WHERE invoice_id = ?';

    // Execute the query to delete data from invoice_products_table
    connection.query(deleteProductsQuery, [id], (error, productsResult) => {
        if (error) {
            console.error('Error deleting invoice products:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // SQL query to delete data from invoice_table
        const deleteInvoiceQuery = 'DELETE FROM invoice_table WHERE id = ?';

        // Execute the query to delete data from invoice_table
        connection.query(deleteInvoiceQuery, [id], (error, invoiceResult) => {
            if (error) {
                console.error('Error deleting invoice:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if any rows were affected (i.e., if the invoice with the given ID exists)
            if (invoiceResult.affectedRows === 0) {
                return res.status(404).json({ error: 'Invoice not found' });
            }

            // Invoice deleted successfully
            res.status(200).json({ message: 'Invoice deleted successfully' });
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});