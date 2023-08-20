"use client";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { TbHome2 } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { HiOutlineChat } from "react-icons/hi";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Reserves() {
  useEffect(() => {
    getUser();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/api/getUser",
    })
      .then((res) => {
        if (res.data.isAdmin == 0) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex flex-row w-[200px] h-[500px] absolute top-[100px] right-[50px] bg-slate-200">
      резервы 
    </div>
  );
}
