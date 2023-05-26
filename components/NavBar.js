import Link from 'next/link';

export default function NavBar() {
  return (
    <div className='flex flex-row w-full z-100  top-1 px-10 py-3 justify-between text-[20px] bg-slate-300'>
      <div className='flex flex-row gap-5' >
      <Link href="/"><h1>главная</h1></Link>
      <Link href="/login"><h1>логин</h1></Link>
      <Link href="/register"><h1>регистрация</h1></Link>
      </div>
      <Link href="/profile"><h1>профиль</h1></Link>
    </div>
  );
}