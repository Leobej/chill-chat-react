import React from "react";

import "./Login.css";

interface LoginProps {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: React.FC<LoginProps> = ({
  room:room,
  setRoom: setRoom,
  username: username,
  setUsername: setUsername,
  setLoggedIn: setLoggedIn,
}) => {
  const checkForLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (room === "" || username === "") {
      alert("Fill in the required fields");
    } else {
      setLoggedIn(true);
    }
  };

  return (
    <div className="login_root">
      <form className="login_form" onSubmit={checkForLogin}>
        <input
          type="text"
          required
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};