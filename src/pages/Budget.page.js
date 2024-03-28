/* 
Budget page for application. Allows users to have thier own application so they have their own data
Uses mui theme for styling and react for a framework. 
*/
import { Button } from '@mui/material'
import { useContext, useState, useEffect } from 'react';
// calls user information for user specific assignments
import { UserContext } from '../contexts/user.context';

// actual budget page
const BudgetPage = () => {
  // state hooks for managing items
  const { logOutUser, user } = useContext(UserContext);
  const [budgetItems, setBudgetItems] = useState([]);
  const [newBudgetItem, setNewBudgetItem] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState(0);
  const [error, setError] = useState('');

  //use effect for getting the user and their budget items
  useEffect(() => {
    if (user) {
      // log for debugging purposes
      console.log('Fetching budget items for user ID:', user.id);
      // calls user and gets the budget items
      fetch(`http://localhost:3001/users/${user.id}/budgetItems`)
        .then(response => response.json())
        .then(data => {
          // log for debugging purposes with the users budget items
          console.log('Fetched budget items:', data);
          setBudgetItems(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [user]);

  // add item to budget
  const addBudgetItem = () => {
    // makes sure all fields are inputted
    if (newBudgetItem.trim() === '' || isNaN(allocatedBudget) || allocatedBudget <= 0) {
      // error if fields aren't 
      setError('Both fields are required, and Allocated Budget must be a valid number greater than 0.');
      return;
    }
    
    // newItem is a way for json to understand what is being created and by whom
    const newItem = { id: Date.now().toString(), item: newBudgetItem, budget: allocatedBudget, userId: user.id };
  
    //fetches user item and posts it to budget and the db.json 
    fetch(`http://localhost:3001/users/${user.id}/budgetItems`, {
      // post method for updating the budget
      // API USED HERE
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //puts item to a json
      body: JSON.stringify(newItem),
    })
      .then(response => {
        if (!response.ok) {
          //if budget item couldn't be added
          throw new Error('Failed to add budget item');
        }
        return response.json();
      })
      .then(updatedItems => {
        // console log for debugging
        console.log('Updated items:', updatedItems);
        // Re fetch data from the server to get the latest items
        fetch('http://localhost:3001/budgetItems')
          .then(response => response.json())
          .then(data => setBudgetItems(data))
          .catch(error => console.error('Error fetching data:', error));
  
        // Clear form fields
        setNewBudgetItem('');
        setAllocatedBudget(0);
        setError('');
      })
      .catch(error => console.error('Error adding budget item:', error));
  };
  
  // removes item from the users budget
  const removeBudgetItem = (id, event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Log to check if the function is being called and the ID is correct
    console.log('Removing budget item with ID:', id);
  
    // Update server data with deleting budget item
    fetch(`http://localhost:3001/budgetItems/${id}`, {
      // API USED HERE FOR DELETING FROM SERVER
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to remove budget item');
        }
        // Log to check if the server response is successful
        console.log('Budget item removed successfully');
  
        // Filter out the removed item from the state
        const updatedItems = budgetItems.filter(item => item.id !== id);
        console.log('Updated items after removal:', updatedItems);
  
        // Update the state with the filtered array
        setBudgetItems(updatedItems);
      })
      .catch(error => console.error('Error removing budget item:', error));
  };
  
  const logOut = async () => {
    try {

      // Clear budget items when the user logs out
      setBudgetItems([]);

      // Calling the logOutUser function from the user context.
      const loggedOut = await logOutUser();
      // Now we will refresh the page, and the user will be logged out and
      // redirected to the login page because of the <PrivateRoute /> component.
      if (loggedOut) {
        window.location.reload(true);
      }
    } catch (error) {
      alert(error)
    }
  }

  // calculates total budget cost of all items
const totalBudget = Array.isArray(budgetItems) && budgetItems.length > 0
  ? budgetItems
      .filter((item) => item.userId === user.id)
      .reduce((total, item) => total + item.budget, 0)
  : 0;

  // returns the actual budget app
  return (
    <form>
      <div className="App">
        <h1>Budget App Version 5.0</h1>
        <label className="left-aligned-label">
          <div className="input-container">
            <span>Name:</span>
            <input
              type="text"
              placeholder="Enter a budget item"
              value={newBudgetItem}
              onChange={(e) => setNewBudgetItem(e.target.value)}
            />
          </div>
        </label>

        <label className="left-aligned-label">
          <div className="input-container">
            <span>Amount ($):</span>
            <input
              type="number"
              placeholder="Allocated Budget"
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(parseInt(e.target.value))}
            />
          </div>
          <input type="button" value="Add to Budget" onClick={addBudgetItem} />
        </label>

        {error && <p className="error">{error}</p>}

        {Array.isArray(budgetItems) && budgetItems.length > 0 ? (
        <>
          <ul>
            {budgetItems
              .filter((item) => item.userId === user.id) 
              .map((item) => (
                <li key={item.id}>
                  {item.item} - Budget: ${item.budget}
                  <button onClick={(e) => removeBudgetItem(item.id, e)}>Remove</button>
                </li>
              ))}
          </ul>

          <li>Total: ${totalBudget}</li>
        </>
      ) : null}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" onClick={logOut}>
            Logout
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BudgetPage;