let db;

// Create a new db request for a "budget" database.
const request = indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = ({target}) => {
    let db = target.result;

    db.createObjectStore('BudgetStore', {autoIncrement: true});
}

