import React from "react";
import { auth } from "../lib/firebase.lib";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    const { value: email } = event.target.email;
    const { value: password } = event.target.password;
    if (email && password) {
      try {
        createUserWithEmailAndPassword(auth, email, password);
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
      <form onSubmit={register} className="max-w-md w-full flex flex-col gap-5">
        <div className="text-center">
          <span className="text-wxl font-bold">Chat App</span>
        </div>
        <label>
          <input
            type="fullname"
            name="fullname"
            className="input input-bordered w-full"
            placeholder="Full Name"
          />
        </label>
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
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
