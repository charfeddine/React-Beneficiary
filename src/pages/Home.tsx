import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export const Home = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) {
      navigate("/signIn");
    }
  });
  const username = useSelector((state: any) => state.user.value.username);
  return (
    <div className="HOME">
      <h1>
        <p> THIS IS HOME PAGE :{username}</p>
      </h1>
    </div>
  );
};
