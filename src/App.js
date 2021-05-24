import "./App.css";
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useRef, useState } from "react";
import config from "./config";

firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  useEffect(() => {
    document.title = "WeebChat 💬";
  }, []);
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>
          <span className="bull">W</span>eeb <span className="bull">C</span>hat
          💬
        </h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Google Sign In
    </button>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="curvy" onClick={() => auth.signOut()}>
        Out 🥺
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt");

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Boom 💣..."
          required
        />
        <button type="submit">☢️ </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt } = props.message;
  // console.log(createdAt.toDate(JSON.stringify(createdAt.toDate())));

  if (createdAt == null) {
    date = null;
  } else {
    var date = createdAt.toDate();
    date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL ||
          "https://images.pexels.com/photos/4052752/pexels-photo-4052752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        }
      />
      <p>
        {text}
        {"  "}
      </p>
      <span>
        <sub>- {date}</sub>
      </span>
    </div>
  );
}

export default App;
