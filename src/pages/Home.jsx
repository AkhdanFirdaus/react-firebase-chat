import React from "react";
import { auth, database, firestore } from "../lib/firebase.lib";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FiPower } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { onValue, set, ref } from "firebase/database";
import { getDoc, doc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

const Home = () => {
  const navigate = useNavigate();

  const chatContainerRef = React.useRef();

  const [user, setUser] = React.useState({});
  console.log(user);
  const [chats, setChats] = React.useState([]);

  const logout = async () => {
    await signOut(auth);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const firestoreRef = doc(firestore, "users", user.uid);
        const snapshot = await getDoc(firestoreRef);
        setUser(snapshot?.data());
      }
    });

    onValue(ref(database, "chats"), (snapshot) => {
      if (snapshot?.toJSON()) {
        const data = Object.values(snapshot.toJSON());
        data.sort((a, b) => a.sentAt - b.sentAt);
        setChats(data);
      }
    });
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, chatContainerRef.current.clientHeight);
  }, [chats]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const { value: message } = event.target.message;
    if (message) {
      const messageId = uuid();
      const userId = auth.currentUser.uid;
      const dbRef = ref(database, "chats/" + messageId);
      set(dbRef, {
        id: messageId,
        message,
        senderId: userId,
        senderName: user.fullName,
        sentAt: new Date().getTime(),
      });
      event.target.message.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div ref={chatContainerRef} className="flex-1 bg-green-400">
        {chats.map((chat) =>
          auth.currentUser.uid === chat.senderId ? (
            <div className="chat chat-end" key={chat.id}>
              <div className="chat-bubble">{chat.message}</div>
            </div>
          ) : (
            <div className="chat chat-start" key={chat.id}>
              <div className="chat-header">
                {chat.senderName}
                <time className="text-xs opacity-50">{chat.sentAt}</time>
              </div>
              <div className="chat-bubble">{chat.message}</div>
            </div>
          )
        )}
      </div>
      <div className="bg-white p-5 sticky bottom-0">
        <form onSubmit={sendMessage} className="flex gap-5">
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
