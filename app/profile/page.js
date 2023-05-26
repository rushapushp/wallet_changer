"use client";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/getUser",
    })
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className=" flex flex-col items-center gap-5">
        <h1>Вы вошли как {username}</h1>
        <div className="flex flex-col items-center gap-5">
          <h1>Верифицируйте свой аккаунт с помощью почты:</h1>
          <input
            className="bg-gray-200 rounded-full"
            type="text"
            name="email"
            placeholder=" email"
          ></input>
        </div>
      </div>
    </div>
  );
}
