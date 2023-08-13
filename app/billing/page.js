"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalAddWallet from "@/components/ModalAddWallet";
import ModalAddCryptoWallet from "@/components/ModalAddCryptoWallet";


export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imgData, setImgData] = useState([]);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showAddCryptoWalletModal, setShowAddCryptoWalletModal] =
    useState(false);
  const [walletsInfo, setWalletsInfo] = useState([]);

  useEffect(() => {
    getUser();
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
        // getWallets(res.data.email);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getWallets = async (email) => {
  //   axios({
  //     method: "get",
  //     withCredentials: true,
  //     url: `http://localhost:3001/api/get-wallets/?email=` + email,
  //   })
  //     .then((res) => {
  //       if (res.status == "200") {
  //         setWalletsInfo(res.data);
  //       }
  //       if (res.status == "201") {
  //         setWalletsInfo(res.data);
  //       }
  //     })
  //     // .then((res) => res.json())
  //     // .then(data => setWalletsInfo(data))
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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

        <button
          onClick={() => setShowAddWalletModal(true)}
          className="bg-green-500 p-2 rounded-[5px] "
        >
          добавить интернет кошелек
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
          добавить крыпто кошелек
        </button>
        {showAddCryptoWalletModal && (
          <ModalAddCryptoWallet
            onClose={() => setShowAddCryptoWalletModal(false)}
          ></ModalAddCryptoWallet>
        )}
      </div>
    </div>
  );
}
