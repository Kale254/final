import { Button } from '@mui/material'
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/user.context';

const BudgetPage = () => {
  // state hooks for managing items
  const { logOutUser, user } = useContext(UserContext);
  const [budgetItems, setBudgetItems] = useState([]);
  const [newBudgetItem, setNewBudgetItem] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      console.log('Fetching budget items for user ID:', user.id);
      fetch(`http://localhost:3001/users/${user.id}/budgetItems`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched budget items:', data);
          setBudgetItems(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [user]);

  const addBudgetItem = () => {
    if (newBudgetItem.trim() === '' || isNaN(allocatedBudget) || allocatedBudget <= 0) {
      setError('Both fields are required, and Allocated Budget must be a valid number greater than 0.');
      return;
    }
  
    const newItem = { id: Date.now().toString(), item: newBudgetItem, budget: allocatedBudget, userId: user.id };
  
    fetch(`http://localhost:3001/users/${user.id}/budgetItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add budget item');
        }
        return response.json();
      })
      .then(updatedItems => {
        console.log('Updated items:', updatedItems);
        // Re-fetch data from the server to get the latest items
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
  
  const removeBudgetItem = (id, event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Log to check if the function is being called and the ID is correct
    console.log('Removing budget item with ID:', id);
  
    // Update server data
    fetch(`http://localhost:3001/budgetItems/${id}`, {
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
const totalBudget = Array.isArray(budgetItems)
? budgetItems.reduce((total, item) => total + item.budget, 0)
: 0;

  /*
  returns the actual budget app
  */
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

        {Array.isArray(budgetItems) && budgetItems.length === 0 ? (
          <p>No budget items</p>
        ) : Array.isArray(budgetItems) ? (
          <ul>
            {budgetItems
              .filter((item) => item.userId === user.id) // Filter items for the current user
              .map((item) => (
                <li key={item.id}>
                  {item.item} - Budget: ${item.budget}
                  <button onClick={(e) => removeBudgetItem(item.id, e)}>Remove</button>
                </li>
              ))}
          </ul>
        ) : null}

        <li>Total: ${totalBudget}</li>

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