"use client";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";

const ModalChangeEmail = ({ onClose }) => {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [changeNotification, setChangeNotification] = useState("");
  const [changeError, setChangeError] = useState("");

  const [wrongOldEmail, setWrongOldEmail] = useState(false);
  const [wrongNewEmail, setWrongNewEmail] = useState(false);
  const [oldEmailError, setOldEmailError] = useState(
    "Почта не должна быть пустой"
  );
  const [newEmailError, setNewEmailError] = useState(
    "Почта не должна быть пустой"
  );
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (oldEmailError || newEmailError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [oldEmailError, newEmailError]);

  const emailHandler = (e) => {
    if (e.target.name == "old_email"){
    setOldEmail(e.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setOldEmailError("Электронный почтовый адрес не корректен");
    } else {
      setOldEmailError("");
    }}
    if (e.target.name == "new_email"){
      setNewEmail(e.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setNewEmailError("Электронный почтовый адрес не корректен");
    } else {
      setNewEmailError("");
    }
    }
  };


  const blurHandler = (e) => {
    switch (e.target.name) {
      case "old_email":
        setWrongOldEmail(true);
        break
      case "new_email":
        setWrongNewEmail(true);
        break
    }
  };

  const changeEmail = () => {
    axios({
      method: "get",
      withCredentials: true,
      url:
        `http://localhost:3001/api/change-email?old_email=` +
        oldEmail +
        "&new_email=" +
        newEmail,
    })
      .then((res) => {
        console.log(res);
        if (res.status == "201") {
          setChangeError("");
          setChangeNotification(res.data);
        }
        if (res.status == "202") {
          setChangeNotification("");
          setChangeError(res.data);
        }
        if (res.status == "203") {
          setChangeError("");
          setChangeNotification(res.data + " " + newEmail);
        }
      })
      .catch((error) => {
        console.log(error);
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

      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-[20px]">Введите вашу старую почту</h1>

        {wrongOldEmail && oldEmailError && (
          <div style={{ color: "red", fontSize: "15px" }}>{oldEmailError}</div>
        )}
        <input
          className="bg-gray-200 rounded-[5px]"
          type="text"
          name="old_email"
          placeholder=" old email"
          onChange={(e) => emailHandler(e)}
          onBlur={e => blurHandler(e)}
        ></input>
        

        <h1 className="text-[20px]">Введите вашу новую почту</h1>

        {wrongNewEmail && newEmailError && (
          <div style={{ color: "red", fontSize: "15px" }}>{newEmailError}</div>
        )}
        <input
          className="bg-gray-200 rounded-[5px]"
          type="text"
          name="new_email"
          placeholder=" new email"
          onChange={(e) => emailHandler(e)}
          onBlur={e => blurHandler(e)}
        ></input>
        <h1 className="text-red-500">{changeError}</h1>
        
        <h1 className="text-green-500">{changeNotification}</h1>

        <button
          className="bg-green-500 p-2 rounded-[5px] disabled:bg-green-200"
          onClick={changeEmail}
          disabled={!formValid}
        >
          изменить почту
        </button>
      </div>
    </div>
  );
};

export default ModalChangeEmail;
