DROP TABLE IF EXISTS expensetracker;

CREATE TABLE expensetracker (
    id SERIAL PRIMARY KEY,
    store VARCHAR(100),
    expensedate date,
    amount real
);
