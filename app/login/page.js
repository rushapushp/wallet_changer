"use client";

import { useState,  } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";



export default function Login() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [emailPasswordReset, setEmailPasswordReset] = useState("");

  const loginUser = () => {
    axios({
      method: "post",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/api/login",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetPassword = () => {
    axios({
      method: "post",
      data: {
        email: emailPasswordReset,
      },
      withCredentials: true,
      url: "http://localhost:3001/api/forget-password",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 ">
      <NavBar></NavBar>

      <h1>Вход</h1>

      <input
        className="bg-gray-200 rounded-full"
        type="text"
        name="username"
        placeholder=" username"
        onChange={(e) => setLoginUsername(e.target.value)}
      ></input>
      <input
        className="bg-gray-200 rounded-full"
        type="password"
        name="username"
        placeholder=" password"
        onChange={(e) => setLoginPassword(e.target.value)}
      ></input>

      <button className="bg-green-500 p-2 rounded-full" onClick={loginUser}>
        войти
      </button>

      {/* <input
        className="bg-gray-200 rounded-full"
        type="text"
        name=" email"
        placeholder=" email"
        onChange={(e) => setEmailPasswordReset(e.target.value)}
      ></input>

      <button className="bg-orange-500 p-2 rounded-full" onClick={resetPassword}>
        восстановить пароль
      </button> */}
    </div>
  );
}
