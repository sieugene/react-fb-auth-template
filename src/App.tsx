import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import "./config/firebase";
import { auth } from "./config/firebase";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [idToken, setIdToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      const token = await currentUser?.getIdToken();
      setIdToken(token || "");
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async () => {
    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Firebase Auth Email</h1>
      {user ? (
        <div>
          <p>Logged user: {user.email}</p>
          <div
            style={{
              width: "100%",
              maxWidth: "330px",
              overflowWrap: "break-word",
            }}
          >
            <p>Token:</p>
            <b style={{ fontSize: 10, borderRadius: "1px solid silver" }}>
              {" "}
              {idToken}
            </b>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  display: "block",
                  margin: "5px 0",
                  padding: "5px",
                  width: "100%",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  display: "block",
                  margin: "5px 0",
                  padding: "5px",
                  width: "100%",
                }}
              />
            </label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleRegister} style={{ marginRight: "10px" }}>
            Create
          </button>
          <button onClick={handleLogin}>SignIn</button>
        </div>
      )}
    </div>
  );
}

export default App;
