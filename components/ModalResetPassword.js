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
  const [emailPasswordReset, setEmailPasswordReset] = useState("");

  const [resetNotification, setResetNotification] = useState("");
  const [resetError, setResetError] = useState("");

  const [wrongEmail, setWrongEmail] = useState(false)
  const [emailError, setEmailError] = useState('Почта не должна быть пустой')
  const [formValid, setFormValid] = useState(false)

  useEffect( () => {
    if ( emailError ){
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [emailError])

  const emailHandler = (e) => {
    setEmailPasswordReset(e.target.value)
    const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())){
      setEmailError('Электронный почтовый адрес не корректен')
    } else {
      setEmailError("")
    }
  }

  const blurHandler = (e) => {
    switch (e.target.name) {
      case 'email':
        setWrongEmail(true)
        break
    }
  } 

  const resetPassword = () => {
    axios({
      method: "post",
      data: {
        email: emailPasswordReset,
      },
      withCredentials: true,
      url: "http://localhost:3001/api/forget-password",
    })
      .then((res) => {
        console.log(res);
        if (res.status == "200") {
          setResetError("");
          setResetNotification(res.data);
        }
        if (res.status == "201") {
          setResetNotification("");
          setResetError(res.data);
        }
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

      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-[20px]">Введите вашу почту</h1>
        
        <h1 className="text-green-500">{resetNotification}</h1>
        {(wrongEmail && emailError) && <div style={{color:'red', fontSize:"15px"}}>{emailError}</div>}
        <input
          className="bg-gray-200 rounded-[5px]"
          type="text"
          name=" email"
          placeholder=" email"
          onChange={e => emailHandler(e)}
          onBlur={e => blurHandler(e)}
        ></input>
        <h1 className="text-red-500">{resetError}</h1>
        <h1 className="text-red-500">{emailError}</h1>
        <button
          className="bg-blue-300 p-2 rounded-[5px]"
          onClick={resetPassword}
          disabled={!formValid}
        >
          восстановить пароль
        </button>
        
      </div>
    </div>
  );
};

export default ModalResetPassword;

{
  /* <exitCross onClick={handleCloseClick}/>  
   className="text-[#373C3D] rounded-full flex justify-center items-center
         hover:rotate-90 transition-all duration-200"
  */
}
