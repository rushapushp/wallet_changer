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
  const [imgData, setImgData] = useState([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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

  return (
    <div className="mt-5 font-semibold">
      <div className=" flex flex-col items-center gap-5 ">
        <div className=" flex row items-center gap-5 ">
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
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 p-5 rounded-2xl bg-slate-300">
          <div className="flex flex-row gap-5">
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
            className="bg-green-500 p-2 rounded-[5px] "
            // onClick={setPersonalInformation}
          >
            сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
