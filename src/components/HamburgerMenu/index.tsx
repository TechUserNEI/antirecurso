'use client';

import useSession from '@/hooks/useSession';
import { Menu, X } from '@/styles/Icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutButton from '../LogoutButton';
import PrimaryButton from '../PrimaryButton';
import ThemeChanger from '../Theme/ThemeChanger';
import TopbarLink from '../TopbarLink';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const session = useSession();

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // when clicking outside the menu, close it
  useEffect(() => {
    if (isOpen) {
      document.querySelector('main')?.addEventListener('click', closeMenu);
    }
    return () => {
      document.querySelector('main')?.removeEventListener('click', closeMenu);
    };
  });

  return (
    <div className="flex md:hidden">
      {isOpen ? (
        <>
          <X className="w-5 h-5 text-primary hover:cursor-pointer" onClick={handleClickMenu} />
          <div className="absolute left-0 flex flex-col w-screen h-auto p-5 space-y-5 bg-white shadow dark:shadow-secondary-dark top-20 dark:bg-secondary-dark z-15">
            <div className="self-end">
              <ThemeChanger />
            </div>

            <TopbarLink onClick={closeMenu} href="/">
              Home
            </TopbarLink>
            <TopbarLink onClick={closeMenu} href="/exams">
              Exames
            </TopbarLink>
            <TopbarLink onClick={closeMenu} href="/scoreboard">
              Scoreboard
            </TopbarLink>
            <TopbarLink onClick={closeMenu} href="/about">
              Sobre
            </TopbarLink>

            <div className="flex flex-col pt-6 mt-6 border-t border-gray-200 gap-y-4">
              {session.user ? (
                <>
                  <Link href={`/profile`}>
                    <PrimaryButton onClick={closeMenu} className="w-full">
                      Aceder ao perfil
                    </PrimaryButton>
                  </Link>
                  <LogoutButton className="w-full" />
                </>
              ) : (
                <>
                  <Link href={`/login`} onClick={closeMenu}>
                    <PrimaryButton className="w-full">Iniciar sessão</PrimaryButton>
                  </Link>
                  <Link
                    href={`/register`}
                    onClick={closeMenu}
                    className="flex items-center justify-center">
                    <span>Criar uma conta</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <Menu className="w-5 h-5 text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      )}
    </div>
  );
};

export default HamburgerMenu;
