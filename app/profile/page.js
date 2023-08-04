"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalUploadNewAvatar from "@/components/ModalUploadNewAvatar";
import ModalChangePassword from "@/components/ModalChangePassword";
import ModalChangeEmail from "@/components/ModalChangeEmail";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [socials, setSocials] = useState("");
  const [file, setFile] = useState();
  const [imgData, setImgData] = useState([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
  const [FNinfo, setFNInfo] = useState("");
  const [SNinfo, setSNInfo] = useState("");
  const [Socinfo, setSocInfo] = useState("");
  const [pincodeInfo, setPincodeInfo] = useState("отправить пин-код");
  const [pincodeSent, setPincodeSent] = useState(false);
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
        getPersonalInformation(res.data.email);
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

  const getPersonalInformation = (email) => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/api/get-personal-information/` + email,
    })
      .then((res) => {
        setFNInfo(res.data.first_name);
        setSNInfo(res.data.second_name);
        setSocInfo(res.data.socials);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendPIN = async () => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/api/send-pin?email=` + email,
    })
      .then((res) => {
        setPincodeInfo(res.data);
        setPincodeSent(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mt-5 font-semibold">
      <div className=" flex flex-col items-center gap-5">
        <div className=" flex row items-center gap-5">
          <button onClick={() => setShowAvatarModal(true)}>
            <img
              className="rounded-2xl w-[120px] h-[120px] object-cover hover:opacity-50 duration-200"
              src={`http://localhost:3001/api/images/` + imgData}
              title="сменить аватарку"
              alt="avatar"
            />
          </button>
          {showAvatarModal && (
            <ModalUploadNewAvatar
              onClose={() => setShowAvatarModal(false)}
            ></ModalUploadNewAvatar>
          )}
          <div className="flex flex-col">
            <h1 className="text-[30px]">{username}</h1>
            <h1 className="text-[20px]">{email}</h1>
            {verification ? (
              <h1 className="text-green-500 text-[10px] flex flex-row gap-1">
                Ваша почта<p className="text-black">{email}</p>подтверждена!
              </h1>
            ) : (
              <h1 className="text-red-500 text-[10px] flex flex-row gap-1">
                Ваша почта <p className="text-black">{email}</p> не
                подтверждена!
              </h1>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 p-5 rounded-2xl bg-slate-300">
          <div className="flex flex-row gap-5">
            <div>
              <div className="flex flex-col ">
                <h1>Имя: {FNinfo}</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" имя"
                  onChange={(e) => setFirstName(e.target.value)}
                ></input>
              </div>
              <div className="flex flex-col">
                <h1>Фамилия: {SNinfo}</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" фамилия"
                  onChange={(e) => setSecondName(e.target.value)}
                ></input>
              </div>

              <div>
                <h1>Соц. сети: {Socinfo}</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" ссылка"
                  onChange={(e) => setSocials(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <div className="flex flex-col ">
                <h1>Кошелек 1</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" Кошелек 1"
                ></input>
              </div>
              <div className="flex flex-col">
                <h1>Крипта 2</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" Крипта 2"
                ></input>
              </div>

              <div>
                <h1>Кошелек 3</h1>
                <input
                  className="bg-gray-200 rounded-[5px]"
                  type="text"
                  name="username"
                  placeholder=" Кошелек 3"
                ></input>
              </div>
            </div>
          </div>

          <button
            className="bg-green-500 p-2 rounded-[5px] ml-[370px]"
            onClick={setPersonalInformation}
          >
            сохранить
          </button>
          {/* <button
            className="bg-green-500 p-2 rounded-[5px] ml-[370px]"
            onClick={getPersonalInformation}
          >
            utn
          </button> */}
        </div>
        <div className="flex flex-row gap-5 ">
          {pincodeSent?(
          <button className="bg-green-200 p-2 rounded-[5px] ">
          {pincodeInfo}
        </button>
          ) : (
            <button onClick={sendPIN} className="bg-green-500 p-2 rounded-[5px] ">
            {pincodeInfo}
          </button>
          )}
          <button
            onClick={() => setShowEmailChangeModal(true)}
            className="bg-green-500 p-2 rounded-[5px] "
          >
            изменить имейл
          </button>
          {showEmailChangeModal && (
            <ModalChangeEmail
              onClose={() => setShowEmailChangeModal(false)}
            ></ModalChangeEmail>
          )}
          <button
            onClick={() => setShowPasswordChangeModal(true)}
            className="bg-green-500 p-2 rounded-[5px] "
          >
            изменить пароль
          </button>
          {showPasswordChangeModal && (
            <ModalChangePassword
              onClose={() => setShowPasswordChangeModal(false)}
            ></ModalChangePassword>
          )}
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
