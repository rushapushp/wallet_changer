"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";

export default function Register() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const registerUser = () => {
    axios({
      method: "post",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/register",
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
      <h1>РЕГИСТРАЦИЯ</h1>

      <input
        className="bg-gray-200 rounded-full"
        type="text"
        name="username"
        placeholder=" username"
        onChange={(e) => setRegisterUsername(e.target.value)}
      ></input>
      <input
        className="bg-gray-200 rounded-full"
        type="password"
        name="username"
        placeholder=" password"
        onChange={(e) => setRegisterPassword(e.target.value)}
      ></input>
      <button className="bg-green-500 p-2 rounded-full" onClick={registerUser}>
        зарегистрироваться
      </button>
    </div>
  );
}
