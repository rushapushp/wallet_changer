"use client";
import Image from "next/image";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { AiOutlineDown } from "react-icons/ai";

const ModalAddWallet = ({ onClose }) => {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    getUser();
  }, []);

  const [walletsAccordionOpen, setWalletsAccordionOpen] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState("");
  const [selectedWalletIcon, setSelectedWalletIcon] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletResponse, setWalletResponse] = useState("");
  const [email, setEmail] = useState("");

  const walletsData = [
    { id: 1, image: "/qiwi.png", name: "Qiwi_RUB" },
    { id: 2, image: "/qiwi.png", name: "Qiwi_USD" },
    { id: 3, image: "/youmoney.png", name: "YooMoney_RUB" },
    { id: 4, image: "/youmoney.png", name: "YooMoney_USD" },
    { id: 5, image: "/payeer.png", name: "Payeer_RUB" },
    { id: 6, image: "/payeer.png", name: "Payeer_USD" },
    { id: 7, image: "/webmoney.png", name: "WebMoney_RUB" },
    { id: 8, image: "/webmoney.png", name: "WebMoney_USD" },
    { id: 9, image: "/paypal.png", name: "PayPal_RUB" },
    { id: 10, image: "/paypal.png", name: "PayPal_USD" },
    { id: 11, image: "/perfectmoney.png", name: "PerfectMoney_RUB" },
    { id: 12, image: "/perfectmoney.png", name: "PerfectMoney_USD" },
  ];
  const addWallet = () => {
    axios({
      method: "post",
      data: {
        email: email,
        wallet: selectedWalletName,
        address: walletAddress,
      },
      withCredentials: true,
      url: "http://localhost:3001/api/add-wallet",
    })
      .then((res) => {
        console.log(res);
        if (res.status == "200") {
          //   setWalletResponse(res.data);
          notifySuccess(res.data);
        }
        if (res.status == "201") {
          //   setWalletResponse(res.data);
          notifySuccess(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const walletIsSelectedHandler = (item) => {
    setSelectedWalletName(item.name);
    setSelectedWalletIcon(item.image);
    setWalletsAccordionOpen(!walletsAccordionOpen);
  };

  const notifySuccess = (text) => toast.success(text);

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

      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-green-500 text-[10px]">{walletResponse}</h1>
        <h1 className="text-[20px]">Выберите платежную систему</h1>
        <button
          className="flex flex-row items-center gap-1"
          onClick={() => setWalletsAccordionOpen(!walletsAccordionOpen)}
        >
          {selectedWalletName === "" ? (
            <h1>Система</h1>
          ) : (
            <h1 className="text-black flex flex-row gap-2">
              <Image src={selectedWalletIcon} height={24} width={24} alt="#" />
              {selectedWalletName}
            </h1>
          )}
          <AiOutlineDown className="hover:rotate-180 transition-all duration-150 " />
        </button>
        {walletsAccordionOpen && (
          <div className="overflow-y-scroll h-[100px]">
            {walletsData.map((item) => (
              <button
                className="text-black flex flex-row gap-2 hover:bg-slate-500 h-[24px] w-[200px]"
                key={item.id}
                onClick={() => walletIsSelectedHandler(item)}
              >
                <Image src={item.image} height={24} width={24} alt="#" />
                {item.name}
              </button>
            ))}
          </div>
        )}
        <h1 className="text-[20px]">Введите номер кошелька</h1>
        <input
          className="bg-gray-200 rounded-[5px]"
          type="text"
          name="wallet"
          placeholder=" номер"
          onChange={(e) => setWalletAddress(e.target.value)}
        ></input>
        <button className="bg-green-500 p-2 rounded-[5px] " onClick={addWallet}>
          добавить
        </button>
      </div>
    </div>
  );
};

export default ModalAddWallet;


