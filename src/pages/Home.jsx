import React from "react";
import { auth, database, firestore, storage } from "../lib/firebase.lib";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FiPower, FiPaperclip } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { onValue, set, ref } from "firebase/database";
import { getDoc, doc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

import prettyBytes from "pretty-bytes";

const Home = () => {
  const navigate = useNavigate();

  const chatContainerRef = React.useRef();

  const [user, setUser] = React.useState({});
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

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      window.alert("File terlalu besar");
      return;
    }
    const fileName = uuid();
    const fileRef = storageRef(storage, "files/" + fileName);
    const results = await uploadBytes(fileRef, file);

    const messageId = uuid();
    const userId = auth.currentUser.uid;
    const dbRef = ref(database, "chats/" + messageId);
    const url = await getDownloadURL(fileRef);

    set(dbRef, {
      id: messageId,
      media: {
        fileName: file.name,
        path: results.metadata.md5Hash,
        size: file.size,
        url,
      },
      senderId: userId,
      senderName: user.fullName,
      sentAt: new Date().getTime(),
    });
  };

  const isImage = (fileName) => {
    const exts = ["jpg", "jpeg", "png", "gif"];
    const isIncluded = [];

    exts.forEach((ext) => {
      isIncluded.push(fileName.endsWith(ext));
    });

    return isIncluded.includes(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <div ref={chatContainerRef} className="flex-1 bg-green-400">
        {chats.map((chat) => {
          const message = () => {
            if (chat.message) {
              return chat.message;
            } else if (chat.media) {
              if (isImage(chat.media.fileName)) {
                return (
                  <img
                    src={chat.media.url}
                    alt={chat.media.fileName}
                    className="max-w-[200px] w-full"
                  />
                );
              }
              return (
                <a
                  href={chat.media.url}
                  download={chat.media.fileName}
                  target="_blank"
                  className="btn max-w-[200px]"
                >
                  {chat.media.fileName} ({prettyBytes(chat.media.size)})
                </a>
              );
            } else {
              return "";
            }
          };

          if (auth.currentUser.uid === chat.senderId) {
            return (
              <div className="chat chat-end" key={chat.id}>
                <div className="chat-bubble">{message()}</div>
              </div>
            );
          }

          return (
            <div className="chat chat-start" key={chat.id}>
              <div className="chat-header">
                {chat.senderName}
                <time className="text-xs opacity-50">{chat.sentAt}</time>
              </div>
              <div className="chat-bubble">{message()}</div>
            </div>
          );
        })}
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
          <label className="btn">
            <span>
              <FiPaperclip />
            </span>
            <input className="hidden" type="file" onChange={uploadFile} />
          </label>
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
