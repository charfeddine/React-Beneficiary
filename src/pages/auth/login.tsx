import { useState } from "react";
import { login, logout } from "../../stores/store";
import { useDispatch, useSelector } from "react-redux";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [newUsername, setNewUsername] = useState("");
  const dispatch = useDispatch();
  const username = useSelector((state: any) => state.user.value.username);
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };
  return (
    <div className="Login">
      <h1>
        <p> Sign In With google </p>
        <button onClick={signInWithGoogle}>Sign In</button>

        {/* <input
          onChange={(e) => {
            setNewUsername(e.target.value);
          }}
        />
        <button
          onClick={() => {
            console.log("test click login");
            dispatch(login({ username: newUsername }));
          }}
        >
          Submit Login
        </button>
        <button
          onClick={() => {
            console.log("test click logout");
            dispatch(logout());
          }}
        >
          Logout
        </button> */}
      </h1>
    </div>
  );
};
