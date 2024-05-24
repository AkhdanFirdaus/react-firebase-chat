import React from "react";
import { auth } from "../firebase.lib";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FiPower } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-green-400">
        <div className="chat chat-start">
          <div className="chat-bubble">
            It&lsquo;s over Anakin, <br />I have the high ground.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble">You underestimate my power!</div>
        </div>
      </div>
      <div className="bg-white p-5">
        <form className="flex gap-5">
          <label className="flex-1">
            <input
              type="text"
              className="input input-bordered w-full"
              name="message"
              placeholder="Type message here"
            />
          </label>
          <div>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
          <div>
            <button onClick={logout} type="button" className="btn btn-error">
              <FiPower />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
