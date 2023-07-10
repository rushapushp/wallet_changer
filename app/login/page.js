"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import ModalResetPassword from "@/components/ModalResetPassword";

export default function Login() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loginNotification, setLoginNotification] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showModal, setShowModal] = useState(false);

  

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
        if (res.status == "200") {
          setLoginError("");
          setLoginNotification(res.data);
        }
        if (res.status == "201") {
          setLoginNotification("");
          setLoginError(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoginError(res.data);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 ">
      <NavBar></NavBar>

      <h1>Вход</h1>
      <h1 className="text-red-500">{loginError}</h1>
      <input
        className="bg-gray-200 rounded-[5px]"
        type="text"
        name="username"
        placeholder=" username"
        onChange={(e) => setLoginUsername(e.target.value)}
      ></input>
      <input
        className="bg-gray-200 rounded-[5px]"
        type="password"
        name="username"
        placeholder=" password"
        onChange={(e) => setLoginPassword(e.target.value)}
      ></input>

      <h1 className="text-green-500">{loginNotification}</h1>

      <button className="bg-green-500 p-2 rounded-[5px]" onClick={loginUser}>
        войти
      </button>

      <div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[12px] hover:underline hover:text-blue-500"
        >
          забыли пароль?
        </button>
        {showModal && (
          <ModalResetPassword
            onClose={() => setShowModal(false)}
          ></ModalResetPassword>
        )}
      </div>
    </div>
  );
}
