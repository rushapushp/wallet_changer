"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [socials, setSocials] = useState("");
  const [file, setFile] = useState();
  const [imgData, setImgData] = useState([]);

  const handleUpload = (e) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("email", email);
    axios
      .post("http://localhost:3001/api/set-avatar-image", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const [verification, setVerification] = useState(false);

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
        setImgData(res.data.avatarImage);
        setUsername(res.data.username);
        setEmail(res.data.email);
        if (res.data.isVerified == 0) {
          setVerification(false);
        } else {
          setVerification(true);
        }
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
      <div className=" flex flex-col items-center gap-5">
        <div className=" flex row items-center gap-5">
          <img
            src={`http://localhost:3001/api/images/` + imgData}
            alt="avatar"
            height={120}
            width={120}
          />
          <h1 className="text-[30px]">{username}</h1>
        </div>

        <div className="flex flex-col items-center gap-5">
          {verification ? (
            <h1 className="text-green-500 flex flex-row gap-1">
              Ваша почта <p className="text-black">{email}</p> подтверждена!
            </h1>
          ) : (
            <h1 className="text-red-500 flex flex-row gap-1">
              Ваша почта <p className="text-black">{email}</p> не подтверждена!
              Некоторые функции платформы ограничены.
            </h1>
          )}

          <div className="flex flex-row gap-5">
            <div className="flex flex-col">
              <h1>Имя</h1>
              <input
                className="bg-gray-200 rounded-[5px]"
                type="text"
                name="username"
                placeholder=" имя"
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
            </div>
            <div className="flex flex-col">
              <h1>Фамилия</h1>
              <input
                className="bg-gray-200 rounded-[5px]"
                type="text"
                name="username"
                placeholder=" фамилия"
                onChange={(e) => setSecondName(e.target.value)}
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
              onChange={(e) => setSocials(e.target.value)}
            ></input>
          </div>

          <button
            className="bg-green-500 p-2 rounded-[5px]"
            onClick={setPersonalInformation}
          >
            сохранить
          </button>
          <div className="flex flex-col justify-center items-center gap-5">
            <h1>Аватар</h1>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button
              onClick={handleUpload}
              className="bg-green-500 p-2 rounded-[5px]"
            >
              upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// /[а-яА-ЯёЁ\s\.\,\!\?\-]/gm
// const socialsHandler = (e) => {
//   setSocials(e.target.value)
//   const regexp = /[a-zA-Z]/gm
//   if (!regexp.test(String(e.target.value).toLowerCase())){
//     setSocialsError('не похоже на ссылку')
//   } else {
//     setSocialsError("")
//   }
// vpizdu nahui
// }
