"use client";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";

const ModalResetPassword = ({ onClose }) => {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };
  const [file, setFile] = useState();
  const [imgData, setImgData] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const handleUpload = (e) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("email", email);
    axios
      .post("http://localhost:3001/api/set-avatar-image", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        setImgData(res.data.avatarImage);
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="absolute left-0 right-0 top-0 bottom-0 m-auto h-[500px] w-[500px] 
    flex flex-row justify-center items-center bg-slate-300 rounded-[5px] shadow-2xl"
    >
      <ImCross
        onClick={handleCloseClick}
        className="absolute right-5 top-5 rounded-[5px] flex flex-row justify-end items-end
         hover:rotate-90 transition-all duration-200"
      />

      <div className="flex flex-col justify-center items-center gap-5">
      <h1>текущая аватарка</h1>
      <img className="rounded-2xl w-[120px] h-[120px] object-cover"
            src={`http://localhost:3001/api/images/` + imgData}
            alt="avatar"
            // height={120}
            // width={120}
          />
        <h1>новая аватарка</h1>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="flex flex-col justify-center items-center"/>
        <button
          onClick={handleUpload}
          className="bg-green-500 p-2 rounded-[5px]"
        >
          обновить
        </button>
      </div>
    </div>
  );
};

export default ModalResetPassword;
