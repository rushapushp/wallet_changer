"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalUploadNewAvatar from "@/components/ModalUploadNewAvatar";
import ModalChangePassword from "@/components/ModalChangePassword";
import ModalChangeEmail from "@/components/ModalChangeEmail";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
// import { advcash.png } from "../../public";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imgData, setImgData] = useState([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [walletList, setWalletList] = useState([{ wallet: "" }]);
  const [walletsAccordionOpen, setWalletsAccordionOpen] = useState(false);
  const [cryptoList, setCryptoList] = useState([{ crypto: "" }]);
  const [cryptoAccordionOpen, setCryptoAccordionOpen] = useState(false);

  const walletsData = [
    { image: "/qiwi.png", name: "Qiwi" },
    { image: "/youmoney.png", name: "ЮMoney" },
    { image: "/payeer.png", name: "Payeer" },
    { image: "/advcash.png", name: "AdvCash" },
    { image: "/perfectmoney.png", name: "PerfectMoney" },
    { image: "/piastrix.png", name: "Piastrix" },
    { image: "/webmoney.png", name: "WebMoney" },
    { image: "/paypal.png", name: "PayPal" },
    { image: "/skrill.png", name: "Skrill" },
    { image: "/payoneer.png", name: "Payoneer" },
  ];

  const handleWalletAdd = () => {
    setWalletList([...walletList, { wallet: "" }]);
  };
  const handleCryptoAdd = () => {
    setCryptoList([...cryptoList, { crypto: "" }]);
  };

  const handleWalletRemove = (index) => {
    const list = [...walletList];
    list.splice(index, 1);
    alert(index);
    setWalletList(list);
  };

  const handleCryptoRemove = (index) => {
    const list = [...cryptoList];
    list.splice(index, 1);
    alert(index);
    setCryptoList(list);
  };

  const handleWalletChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...walletList];
    list[index][name] = value;
    setWalletList(list);
  };

  const handleCryptoChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...cryptoList];
    list[index][name] = value;
    setCryptoList(list);
  };

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
      <div className=" flex flex-col items-center gap-2 ">
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

        <div className="flex flex-col items-center gap-5 p-5 rounded-2xl bg-slate-300 w-[900px] justify-between">
          <div className="flex flex-row gap-6">
            <div className="flex flex-col justify-center items-center ">
              <h1>Интернет кошельки</h1>
              {walletList.map((singleWallet, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 py-2 items-center"
                >
                  <div className="flex flex-row gap-1">
                    <div className="flex flex-col  z-100 ">
                      <button
                        className="flex flex-row items-center gap-1"
                        onClick={() =>
                          setWalletsAccordionOpen(!walletsAccordionOpen)
                        }
                      >
                        Система
                        <AiOutlineDown className="hover:rotate-180 transition-all duration-150 " />
                      </button>
                      {walletsAccordionOpen && (
                        <div>
                          {walletsData.map((item) => (
                            <button
                              className="text-black flex flex-row gap-1 hover:bg-slate-500 h-[24px] w-[150px]"
                              key={item}
                            >
                              <Image
                                src={item.image}
                                height={24}
                                width={24}
                                alt="#"
                              />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      value={singleWallet.wallet}
                      onChange={(e) => handleWalletChange(e, index)}
                      className="bg-gray-200 rounded-[5px] "
                      type="text"
                      name="wallet"
                      placeholder=" кошелек"
                    ></input>
                    {walletList.length > 1 && (
                      <button
                        className="bg-red-500 p-1 rounded-[5px] "
                        onClick={() => handleWalletRemove(index)}
                      >
                        <AiOutlineClose />
                      </button>
                    )}
                  </div>
                  {walletList.length - 1 === index &&
                    walletList.length < 10 && (
                      <button
                        className="bg-green-500 p-[2px] w-[40px]  rounded-[5px] "
                        onClick={handleWalletAdd}
                      >
                        +
                      </button>
                    )}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center items-center ">
              <h1>Крипто кошельки</h1>
              {cryptoList.map((singleCrypto, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 py-2 items-center"
                >
                  <div className="flex flex-row gap-1">
                    <div className="flex flex-col  z-100 ">
                      <button
                        className="flex flex-row items-center gap-1"
                        onClick={() =>
                          setCryptoAccordionOpen(!cryptoAccordionOpen)
                        }
                      >
                        Система
                        <AiOutlineDown className="hover:rotate-180 transition-all duration-150 " />
                      </button>
                      {cryptoAccordionOpen && (
                        <div>
                          {walletsData.map((item) => (
                            <button
                              className="text-black flex flex-row gap-1 hover:bg-slate-500 h-[24px] w-[150px]"
                              key={item}
                            >
                              <Image
                                src={item.image}
                                height={24}
                                width={24}
                                alt="#"
                              />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      value={singleCrypto.crypto}
                      onChange={(e) => handleCryptoChange(e, index)}
                      className="bg-gray-200 rounded-[5px] "
                      type="text"
                      name="wallet"
                      placeholder=" кошелек"
                    ></input>
                    {cryptoList.length > 1 && (
                      <button
                        className="bg-red-500 p-1 rounded-[5px] "
                        onClick={() => handleCryptoRemove(index)}
                      >
                        <AiOutlineClose />
                      </button>
                    )}
                  </div>
                  {cryptoList.length - 1 === index &&
                    cryptoList.length < 10 && (
                      <button
                        className="bg-green-500 p-[2px] w-[40px]  rounded-[5px] "
                        onClick={handleCryptoAdd}
                      >
                        +
                      </button>
                    )}
                </div>
              ))}
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
