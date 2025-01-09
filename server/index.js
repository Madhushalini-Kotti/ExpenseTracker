import express from "express";
import cors from "cors";
import pg from "pg";
import env from "dotenv";

env.config();

const app = express()
const port = process.env.PORT;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port : process.env.DB_PORT
})

db.connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.use(express.static('build'));

app.get("/expenses", async (req, res) => {
    try {
        const result = await db.query("SELECT id, store, TO_CHAR(expensedate, 'YYYY-MM-DD') AS expensedate, amount FROM expensetracker");

        console.log("Expenses fetched successfully:", result.rows);
        res.status(200).json(result.rows);
        
    } catch (error) {
        console.error("Error occurred while fetching the expenses:", error.message);
        res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});


app.post("/newExpense", async (req, res) => {
    const { store, expensedate, amount } = req.body;

    console.log(store, expensedate, amount);

    // Validate input
    if (!store || !expensedate || !amount) {
        return res.status(400).json({ error: "All fields (store, date, amount) are required." });
    }

    try {
        const result = await db.query(
            "INSERT INTO expensetracker (store, expensedate, amount) VALUES ($1, $2, $3) RETURNING *",
            [store, expensedate, amount]
        );

        if (result.rows.length > 0) {
            console.log("New expense inserted successfully:", result.rows[0]);
            return res.status(201).json({ message: "Expense added successfully", expense: result.rows[0] });
        } else {
            console.error("Failed to insert the expense, no rows returned.");
            return res.status(500).json({ error: "Failed to add expense. Please try again later." });
        }
    } catch (error) {
        console.error("Error occurred while adding new expense:", error.message);
        return res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});

app.post("/deleteExpense", async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id) {
        return res.status(400).json({ error: "Expense ID is required." });
    }

    try {
        const result = await db.query(
            "DELETE FROM expensetracker WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length > 0) {
            console.log("Expense deleted successfully:", result.rows[0]);
            return res.status(200).json({ message: "Expense deleted successfully", deletedExpense: result.rows[0] });
        } else {
            console.error("Expense not found or already deleted.");
            return res.status(404).json({ error: "Expense not found or already deleted." });
        }
    } catch (error) {
        console.error("Error occurred while deleting the expense:", error.message);
        return res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});


app.listen(port, () => {
    console.log(`App running on port ${port}`);
})