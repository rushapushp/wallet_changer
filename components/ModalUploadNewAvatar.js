"use client";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import avatar from "../public/avatar.jpg";

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
      .then((res) => {
        console.log(res);
        notifySuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
        notifyError(err.message);
      });
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

  const notifySuccess = (text) => toast.success(text);
  const notifyError = (text) => toast.error(text);

  return (
    <div
      className="absolute left-0 right-0 top-0 bottom-0 m-auto h-[500px] w-[500px] 
    flex flex-row justify-center items-center bg-slate-300 rounded-[5px] shadow-2xl"
    >
      <ToastContainer />
      <ImCross
        onClick={handleCloseClick}
        className="absolute right-5 top-5 rounded-[5px] flex flex-row justify-end items-end
         hover:rotate-90 transition-all duration-200"
      />

      <div className="flex flex-col justify-center items-center gap-5">
        <h1>текущая аватарка</h1>
        <Image
          className="rounded-2xl shadow-2xl w-[120px] h-[120px] object-cover hover:opacity-50 duration-200"
          src={
            imgData == null
              ? avatar
              : `http://localhost:3001/api/images/` + imgData
          }
          width="600"
          height="600"
          title="сменить аватарку"
          alt="avatar"
        />
        <h1>новая аватарка</h1>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex flex-col justify-center items-center"
        />
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
