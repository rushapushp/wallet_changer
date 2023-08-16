"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalAddWallet from "@/components/ModalAddWallet";
import ModalAddCryptoWallet from "@/components/ModalAddCryptoWallet";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imgData, setImgData] = useState([]);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showAddCryptoWalletModal, setShowAddCryptoWalletModal] =
    useState(false);
  const [walletsEmpty, setWalletsEmpty] = useState("");
  const [walletsInfo, setWalletsInfo] = useState([]);
  const [walletIcons, setWalletIcons] = useState([]);

  useEffect(() => {
    getUser();
    getGateways();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        setImgData(res.data.avatarImage);
        setUsername(res.data.username);
        setEmail(res.data.email);
        // setUserId(res.data.id);
        getWallets(res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWallets = async (userId) => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/api/get-wallets/?userId=` + userId,
    })
      .then((res) => {
        if (res.status == "201") {
          setWalletsEmpty(res.data);
        }
        if (res.status == "200") {
          setWalletsInfo(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const both = "both";
  const getGateways = async () => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/api/get-gateways/?isCrypto=` + both,
    })
      .then((res) => {
        setWalletIcons(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mt-5 font-semibold">
      <div className=" flex flex-col items-center gap-2 ">
        <div className=" flex row items-center gap-5 ">
          <img
            className="rounded-2xl w-[120px] h-[120px] object-cover "
            src={`http://localhost:3001/api/images/` + imgData}
            alt="avatar"
          />

          <div className="flex flex-col">
            <h1 className="text-[30px]">{username}</h1>
            <h1 className="text-[20px]">{email}</h1>
          </div>
        </div>
        <div className="flex flex-col w-[max] p-[25px] bg-slate-300 items-center rounded-2xl">
          <div className="flex flex-row justify-between text-gray-500 w-[300px] text-[10px]">
            <p>кошелек</p>
            <p>номер</p>
            <p>обновлен</p>
          </div>
          {walletsEmpty == "" ? (
            walletsInfo.map((walletsInfo, index) => (
              <div
                key={index}
                className="flex flex-row gap-3 w-[300px] hover:bg-slate-500 rounded-[5px] p-[5px] justify-between"
              >
                <Image
                  src={walletIcons[walletsInfo.gateway_id - 1].image}
                  height={24}
                  width={24}
                  alt="#"
                />
                <p>{walletsInfo.score}</p>
                <p className="text-gray-500 ">
                  {moment(walletsInfo.upd_at, "YYYYMMDD").fromNow()}
                </p>
              </div>
            ))
          ) : (
            <h1 className="p-5">{walletsEmpty}</h1>
          )}
        </div>
        <div className="flex flex-row gap-2">
        <button
          onClick={() => setShowAddWalletModal(true)}
          className="bg-green-500 p-2 rounded-[5px] "
        >
          + интернет кошелек
        </button>
        {showAddWalletModal && (
          <ModalAddWallet
            onClose={() => setShowAddWalletModal(false)}
          ></ModalAddWallet>
        )}
        <button
          onClick={() => setShowAddCryptoWalletModal(true)}
          className="bg-green-500 p-2 rounded-[5px] "
        >
          + крыпто кошелек
        </button>
        {showAddCryptoWalletModal && (
          <ModalAddCryptoWallet
            onClose={() => setShowAddCryptoWalletModal(false)}
          ></ModalAddCryptoWallet>
        )}
        </div>
      </div>
    </div>
  );
}
