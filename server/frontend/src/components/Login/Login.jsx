import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login_url = "/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(login_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const json = await res.json();

      if (json.status && json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        navigate("/"); // go home (Dealers)
      } else {
        alert("The user could not be authenticated.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed due to a network or server error.");
    }
  };

  return (
    <div>
      <div onClick={onClose ? onClose : undefined}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="modalContainer"
        >
          <form className="login_panel" onSubmit={login}>
            <div>
              <span className="input_field">Username </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <span className="input_field">Password </span>
              <input
                name="psw"
                type="password"
                placeholder="Password"
                className="input_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <input className="action_button" type="submit" value="Login" />
              <input
                className="action_button"
                type="button"
                value="Cancel"
                onClick={() => navigate("/")}
              />
            </div>

            <Link className="loginlink" to="/register">
              Register Now
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;