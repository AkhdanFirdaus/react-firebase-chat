import React from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase.lib";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    const { value: email } = event.target.email;
    const { value: password } = event.target.password;
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        window.alert(error.message);
      }
    }
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={login} className="max-w-md w-full flex flex-col gap-5">
        <div className="text-center">
          <span className="text-wxl font-bold">Chat App</span>
        </div>
        <label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Email"
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            className="input input-bordered w-full"
            placeholder="Password"
          />
        </label>
        <div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </div>
        <div className="text-center">
          <Link to="/register">Doesn{"'"}t have an acoount? Register Here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
