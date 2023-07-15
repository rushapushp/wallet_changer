"use client";
import Link from 'next/link';
import { CgProfile } from "react-icons/cg";
import { TbHome2 } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";

export default function NavBar() {
  return (
    <div className='flex flex-row w-full z-100  top-1 px-10 py-3 justify-between text-[20px] bg-slate-300'>
      <div className='flex flex-row gap-7' >
      <Link href="/"><TbHome2 className="w-[30px] h-[30px] rounded-[5px] hover:bg-slate-400 transition-all duration-50" /></Link>
      <Link href="/login"><FiLogIn className="w-[30px] h-[30px] rounded-[5px] hover:bg-slate-400 transition-all duration-50" /></Link>
      <Link href="/register"><GoPersonAdd className="w-[30px] h-[30px] rounded-[5px] hover:bg-slate-400 transition-all duration-50" /></Link>
      </div>
      <Link href="/profile"><CgProfile className="w-[30px] h-[30px] rounded-full hover:bg-slate-400 transition-all duration-50" /></Link>
    </div>
  );
}