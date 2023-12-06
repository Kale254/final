// page for logging in the user from an already made account
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";

// beggining of login function 
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Using usermanagement context to get & set the user details here
  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

  // Set the initial state with predefined values
  const [form, setForm] = useState({
    email: "example@example.com",
    password: "examplepassword",
  });

  // function will be called whenever the user edits the form.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // redirect the user to the appropriate page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  // checks if user has already logged in and then automatically redirects them to the page
  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        // Redirecting them once fetched.
        redirectNow();
      }
    }
  };

  // This useEffect will run only once when the component is mounted.
  // helpingin verifying whether the user is already logged in or not.
  useEffect(() => {
    loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function gets fired when the user clicks on the "Login" button.
  const onSubmit = async (event) => {
    try {
      // Hpassing user details to our emailPasswordLogin
      const user = await emailPasswordLogin(form.email, form.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      if (error.statusCode === 401) {
        alert("Invalid username/password. Try again!");
      } else {
        alert(error);
      }
    }
  };

  // returns the actual login form with styling of mui
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      <h1>Login</h1>
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
        Login
      </Button>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
