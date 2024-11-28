import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/noautorized.png";
import { Button } from "@nextui-org/react";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="min-w-screen min-h-screen bg-blue-10 flex items-center p-5 lg:p-10 overflow-hidden relative">
        <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="mb-1 md:mb-10 text-gray-600 font-light">
              <h1 className="font-black uppercase text-3xl lg:text-5xl text-blue-500 mb-10">
                Página no Autorizada!
              </h1>

              <p>
                Nos disculpamos, pero la página que estás intentando acceder no
                se encuentra disponible en este momento. Por favor, verifica la
                URL e inténtalo de nuevo.
              </p>
              <p>
                Si crees que esto es un error, por favor, contacta con el
                administrador del sistema para obtener asistencia adicional.
              </p>
            </div>
            <div className="mb-10 md:mb-0">
              <Button
                size="lg"
                color="primary"
                onClick={() => navigate(-1)}
                variant="ghost"
              >
                <i className="fa-solid fa-arrow-left"></i> Volver atras
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center">
            <img src={Logo} className="" alt="" />
          </div>
        </div>
        <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
        <div className="w-96 h-full bg-blue-300 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
      </div>
    </section>
  );
};
