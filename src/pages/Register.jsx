import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { auth, firestore } from "../lib/firebase.lib";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    const { value: fullName } = event.target.fullName;
    const { value: email } = event.target.email;
    const { value: password } = event.target.password;
    if (email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const { uid } = userCredential.user;
        const docRef = doc(firestore, "users", uid);
        await setDoc(docRef, {
          fullName,
        });
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
            type="text"
            name="fullName"
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
        <div className="text-center">
          <Link to="/login">Already have an acoount? Login Here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
