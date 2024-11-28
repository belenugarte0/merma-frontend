import {
  RiArrowDownSLine,
  RiLogoutCircleRLine,
  RiUserLine,
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";
import { useAuthStore, useProfileStore } from "../../stores";
import Logo from "../../assets/images/Logo.png";
import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const HeaderPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const token = useAuthStore((state) => state.token);
  const profiles = useProfileStore((state) => state.profiles);
  const getProfiles = useProfileStore((state) => state.getProfiles);
  const profile = profiles[0] || {};
  const handleFetchProfiles = async () => {
    setIsLoading(true);
    await getProfiles(token!);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProfiles();
  }, []);
  return (
    <header className="topbar h-16 sm:h-18 p-4 sm:p-6 md:p-8 flex justify-between items-center">
      <div className="position-relative">
        <span className="badge text-white shadow py-1 px-2 rounded-md ml-10 sm:ml-5">
          {user!.roles}
        </span>
      </div>
      <nav className="flex items-center gap-2 ">
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 p-2 rounded-lg transition-colors">
              <Image
                width={100}
                height={100}
                alt="profile"
                src={profile.image || Logo}
                radius="full"
                shadow="md"
                className="w-9 h-9 object-cover rounded-full shadow-xl"
                style={{ width: "40px", height: "40px" }}
              />
              <span className="hidden sm:inline text-sm">{user!.email}</span>
              <RiArrowDownSLine />
            </MenuButton>
          }
          align="end"
          arrow
          transition
          menuClassName="bg-secondary-100 p-4"
        >
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="profile"
              className="rounded-lg transition-colors  flex items-center gap-x-4 text-gray-600 flex-1 "
            >
              <RiUserLine /> Perfil
            </Link>
          </MenuItem>
          <hr className="border-gray-200" />

          <MenuItem className="p-0 hover:bg-transparent">
            <a
              className="rounded-lg transition-colors  flex items-center gap-x-4 text-gray-600 flex-1"
              onClick={logout}
            >
              <RiLogoutCircleRLine /> Cerrar sesión
            </a>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};
