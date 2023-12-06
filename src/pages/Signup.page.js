// signup page for users to be registered to use the application
import { Button} from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";

// start of signup function
const Signup = () => {
  // navigation for putting users to correct page and location for getting location of page
  const navigate = useNavigate();
  const location = useLocation();

  // setting up the for to make sure users are signed up and it goes to database
  const { emailPasswordSignup } = useContext(UserContext);
  // makes sure the form is filled with something before users loggin
  const [form, setForm] = useState({
    email: "example@example.com",
    password: "examplepassword"
  });

  
  // This function will be called whenever the user edits the form.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // redirects to the budget page
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  // handles the submit button
  const onSubmit = async () => {
    try {
      // Call your signup function from the UserContext
      const user = await emailPasswordSignup(form.email, form.password);

      // If the user is successfully created in your authentication system,
      // send the user data to your server
      if (user) {
        // Send a POST request to server
        const response = await fetch('http://localhost:3001/budgetItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        if (response.ok) {
          // User data has been successfully stored in your server
          redirectNow();
        } else {
          throw new Error('Failed to store user data in the server');
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // returns the signup page for client side
  // uses mui for styling 
  return (
    <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
      <h1>Signup</h1>
      <input
        label="Email"
        type="email"
        variant="outlined"
        name="email"
        placeholder={form.email === "example@example.com" ? "Enter your email" : ""}
        value={form.email}
        onChange={onFormInputChange}
        onFocus={() => setForm({ ...form, email: "" })}
        onBlur={() => {
          if (form.email === "") {
            setForm({ ...form, email: "example@example.com" });
          }
        }}
        style={{ marginBottom: "1rem" }}
      />
      <input
        label="Password"
        type="password"
        variant="outlined"
        name="password"
        placeholder={form.password === "examplepassword" ? "Enter your password" : ""}
        value={form.password}
        onChange={onFormInputChange}
        onFocus={() => setForm({ ...form, password: "" })}
        onBlur={() => {
          if (form.password === "") {
            setForm({ ...form, password: "examplepassword" });
          }
        }}
        style={{ marginBottom: "1rem" }}
      />

      <Button variant="contained" color="primary" onClick={onSubmit}>
        Signup
      </Button>
      <p>Have an account already? <Link to="/login">Login</Link></p>
    </form>
  );
};

export default Signup;
