import React, { useEffect, useState } from 'react'
import './Content.css'

function Content() {

    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [expenses, setExpenses] = useState([]);

    const [expenseTotal, setExpenseTotal] = useState(0);

    const getExpenses = () => {
        fetch("/expenses")
            .then((res) => res.json())
            .then(json => {

                setExpenses(json);

                const totalExpense = json.reduce((sum, expense) => {
                    return sum + parseFloat(expense.amount);
                }, 0);

                setExpenseTotal(totalExpense.toFixed(2));
                
            });
        
    }

    useEffect(() => {
        getExpenses()
    }, [])

    const [newExpense, setNewExpense] = useState({
        store: "",
        expensedate: "",
        amount: 0,
    });


    const handleNewExpenseChange = (event) => {
        const value = event.target.value;
        const field = event.target.name;
        setNewExpense((prevValue) => {
            return {...prevValue, [field] : value}
        })
    }

    const handleCreateExpense = async () => {

        const data = {
            store: newExpense.store,
            expensedate: newExpense.expensedate,
            amount : newExpense.amount
        }
        
        setNewExpense({
            store: "",
            expensedate: getTodayDate(),
            amount: 0,
        })

        const response = await fetch("/newExpense", {
            "method": "POST",
            "headers": {
                'Content-Type' : 'application/json'
            },
            'body' : JSON.stringify(data)
        })

        if (!response.ok) {
            console.log("Couldn't add new expenses");
            return;
        } 

        const responseData = await response.json();
        if (responseData) {
            console.log("New expense added successfully", responseData);
        }

        getExpenses();

    }

    const handleDeleteExpense = async (event) => {

        const expenseId = event.target.value;

        const data = {
            id : expenseId
        }

        const response = await fetch("/deleteExpense", {
            "method": "POST",
            "headers": {
                'Content-Type' : 'application/json'
            },
            'body' : JSON.stringify(data)
        })

        if (!response.ok) {
            const responseData = await response.json();
            console.log("Couldn't delete the data", responseData.error);
            return;
        } 

        const responseData = await response.json();
        console.log("Expense delete successfully", responseData);

        getExpenses();
    }

  return (
      <div className='Content'>
          <div className='New-expense'>
              <label>
                  Expense:
                  <input name="store" value={newExpense.store} placeholder='Expense Name' onChange={handleNewExpenseChange} />
              </label>
              <label>
                Shopping Date: 
                  <input name="expensedate" value={newExpense.expensedate} type="date" onChange={handleNewExpenseChange}/>
                </label>
              <label>
                  Amount:
                  <input name="amount" value={newExpense.amount} placeholder='Amount' onChange={handleNewExpenseChange}/>
              </label>
              
              <button onClick={handleCreateExpense}>Add</button>
          </div>

          <div className="Amount-Container">
              <span>
                   Total Expenses : {expenseTotal} $
              </span>
              
          </div>

          <div className='Expenses-container'>
              <h1 style={{color: "red"}}>Expenses</h1>
              {
                  expenses.map((expense) => {
                      return (<div className='Expense-item' key={expense.id}>
                          <span>
                              {expense.store}
                          </span>
                          <span>
                              {expense.expensedate}
                          </span>
                          <span>
                              {expense.amount}
                          </span>
                          <button value={expense.id} onClick={handleDeleteExpense}>Delete</button>
                      </div>)
                  })
              }
          </div>

    </div>
  )
}

export default Content