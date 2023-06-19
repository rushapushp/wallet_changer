"use client";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getUser();
    getUserEmail();
  }, []);

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserEmail = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUserEmail",
    })
    .then((res) => {
      console.log(res.data);
    })
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <div>
      <NavBar></NavBar>
      <div className=" flex flex-col items-center gap-5">
        <h1>Вы вошли как: {username}</h1>
        <div className="flex flex-col items-center gap-5">
          <h1>Ваша почта: {email} верифицирована!</h1>
          <button onClick={getUserEmail}>cccccccccccc</button>
        </div>
      </div>
    </div>
  );
}
