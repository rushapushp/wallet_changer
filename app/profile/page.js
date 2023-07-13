"use client";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const[firstName, setFirstName] = useState("")
  const[secondName, setSecondName] = useState("")
  const[socials, setSocials] = useState("")

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        setUsername(res.data.username);
        setEmail(res.data.email)
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const setPersonalInformation = () => {
    axios({
      method: "post",
      data: {
        email: email,
        first_name: firstName,
        second_name: secondName,
        socials: socials,
      },
      withCredentials: true,
      url: "http://localhost:3001/api/set-personal-information",
    })
      .then((res) => {
        console.log(res);
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
          
          <div className="flex flex-row gap-5">
            <div className="flex flex-col">
              <h1>Имя</h1>
              <input
                className="bg-gray-200 rounded-[5px]"
                type="text"
                name="username"
                placeholder=" имя"
                onChange={e => setFirstName(e.target.value)}
              ></input>
            </div>
            <div className="flex flex-col">
              <h1>Фамилия</h1>
              <input
                className="bg-gray-200 rounded-[5px]"
                type="text"
                name="username"
                placeholder=" фамилия"
                onChange={e => setSecondName(e.target.value)}
              ></input>
            </div>
          </div>
          <div>

          <h1>Соц. сеть для связи с вами</h1>
          <input
            className="bg-gray-200 rounded-[5px]"
            type="text"
            name="username"
            placeholder=" ссылка"
            onChange={e => setSocials(e.target.value)}
          ></input>
          </div>
          <button className="bg-green-500 p-2 rounded-[5px]" onClick={setPersonalInformation}>
        сохранить
      </button>
        </div>
      </div>
    </div>
  );
};


