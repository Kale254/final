import { createContext, useState } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";
 
// Creating a Realm App Instance
const app = new App(APP_ID);
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.
export const UserContext = createContext();
 
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [userBudgetItems, setUserBudgetItems] = useState([]);
 
 // Function to log in user into our App Service app using their email & password
 const emailPasswordLogin = async (email, password) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   setUser(authenticatedUser);
   return authenticatedUser;
 };
 
 // Function to sign up user into our App Service app using their email & password
 const emailPasswordSignup = async (email, password) => {
    try {
        await app.emailPasswordAuth.registerUser({email, password});
        return emailPasswordLogin(email, password);
    } catch (error) {
        throw error;
    }
}
 
const fetchUser = async () => {
  if (!app.currentUser) return false;
  try {
    await app.currentUser.refreshCustomData();
    setUser(app.currentUser);

    // Fetch user-specific budget items
    const response = await fetch(`http://localhost:3001/budgetItems/${app.currentUser.id}`);
    const data = await response.json();
    setUserBudgetItems(data);

    return app.currentUser;
  } catch (error) {
    throw error;
  }
};
 
 // Function to logout user from our App Services app
 const logOutUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.logOut();
     // Setting the user to null once loggedOut.
     setUser(null);
     return true;
   } catch (error) {
     throw error
   }
 }
 
 return (
  <UserContext.Provider
    value={{
      user,
      setUser,
      fetchUser,
      emailPasswordLogin,
      emailPasswordSignup,
      logOutUser,
      userBudgetItems, // Include user-specific budget items in the context
    }}
  >
    {children}
  </UserContext.Provider>
);
};