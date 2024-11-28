import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiArrowRightSLine, RiMenu3Line } from "react-icons/ri";
import Logo from "../../assets/images/Logo.png";
import { useAuthStore } from "../../stores";

export const SideMenu = () => {
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [showSubmenuAdmin, setShowSubmenuAdmin] = useState(false);

  const hasPermission = (permission:any) => {
    return user && user.permissions && user.permissions.includes(permission);
  };

  const handleMenuItemClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
    setShowSubmenuAdmin(false);
  };

  return (
    <>
      <aside
        className={`sidebar-wrapper fixed xl:static w-[64%] sm:w-[60%] md:w-[50%] lg:w-[30%] xl:w-[290px] h-[99%] top-0 bg-[#f8f9fa] p-4 flex flex-col justify-between z-50  ${
          showMenu ? "left-0" : "-left-full"
        } transition-all xl:transition-none `}
      >
        <div className="sidemenu__logo flex items-center gap-4 mb-4 md:mb-6">
          <img src={Logo} alt="Logistic" className="max-w-[50px]" />
          <div className="leading-[.5] flex-grow">
            <h1 className="font-bold text-xl textColor">Logistic</h1>
            <p className="text-sm font-light textColor">La Papelera</p>
          </div>
          {showMenu && (
            <div className="ml-auto">
              <button
                onClick={() => setShowMenu(false)}
                className="text-black p-3 rounded-full z-50"
              >
                <RiMenu3Line />
              </button>
            </div>
          )}
        </div>
        <hr />

        <ul className="space-y-1 flex-grow">
          <li>
            <Link
              to="home"
              className={`sidemenu__link ${
                pathname.includes("home") && "sidemenu__link--active "
              }`}
              onClick={handleMenuItemClick}
            >
              <span className="icon">
                <i className="fa-solid fa-house"></i>
              </span>
              DashBoard
            </Link>
          </li>

          {(hasPermission("ver-role") ||
            hasPermission("ver-usuario") ||
            hasPermission("ver-camion") ||
            hasPermission("ver-log_Acceso")) && (
            <li>
              <button
                onClick={() => setShowSubmenuAdmin(!showSubmenuAdmin)}
                className={`sidemenu__link ${
                  (pathname.includes("users") ||
                    pathname.includes("roles_permissions") ||
                    pathname.includes("log_access")) &&
                  "sidemenu__link--active"
                }`}
              >
                <span className="icon">
                  <i className="fa-solid fa-clipboard-list"></i>
                </span>
                Administración
                <RiArrowRightSLine
                  className={`mt-1 ${
                    showSubmenuAdmin && "rotate-90"
                  } transition-all`}
                />
              </button>
              <ul
                className={`${
                  showSubmenuAdmin ? "auto" : "h-0"
                } overflow-y-hidden transition-all`}
              >
                {hasPermission("ver-usuario") && (
                  <li>
                    <Link
                      to="users"
                      className={`sidesubmenu ${
                        pathname.includes("users") && "sidemenu__link--active"
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      Usuarios
                    </Link>
                  </li>
                )}
                {hasPermission("ver-role") && (
                  <li>
                    <Link
                      to="roles_permissions"
                      className={`sidesubmenu ${
                        pathname.includes("roles_permissions") &&
                        "sidemenu__link--active"
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      Roles
                    </Link>
                  </li>
                )}
                {hasPermission("ver-log_Acceso") && (
                  <li>
                    <Link
                      to="log_access"
                      className={`sidesubmenu ${
                        pathname.includes("log_access") &&
                        "sidemenu__link--active"
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      Log de Acceso
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}
          {hasPermission("ver-ordenes") && (
            <li>
              <Link
                to="orders"
                className={`sidemenu__link ${
                  pathname.includes("orders") && "sidemenu__link--active"
                }`}
                onClick={handleMenuItemClick}
              >
                <span className="icon">
                  <i className="fa-solid fa-box"></i>
                </span>
                Ordenes
              </Link>
            </li>
          )}

          {hasPermission("ver-ordenesd") && (
            <li>
              <Link
                to="classific"
                className={`sidemenu__link ${
                  pathname.includes("classific") && "sidemenu__link--active"
                }`}
                onClick={handleMenuItemClick}
              >
                <span className="icon">
                  <i className="fa-solid fa-paint-brush"></i>
                </span>
                Diseño
              </Link>
            </li>
          )}
          {hasPermission("ver-molds") && (
            <li>
              <Link
                to="report_merma"
                className={`sidemenu__link ${
                  pathname.includes("report_merma") && "sidemenu__link--active"
                }`}
                onClick={handleMenuItemClick}
              >
                <span className="icon">
                  <i className="fa-solid fa-table"></i>
                </span>
                Reporte Produccion
              </Link>
            </li>
          )}
        </ul>
      </aside>

      {!showMenu && (
        <button
          onClick={() => setShowMenu(true)}
          className="xl:hidden fixed top-4 left-4 text-black p-3 rounded-full z-50"
        >
          <RiMenu3Line />
        </button>
      )}
    </>
  );
};
