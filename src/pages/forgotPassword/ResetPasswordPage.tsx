import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Logo from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const { token } = useParams();
  const VerifyResetToken = useAuthStore((state) => state.VerifyResetToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const ResetPassword = useAuthStore((state) => state.ResetPassword);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { password } =
      e.target as typeof e.target & {
        password: { value: string };
      };

    const validationErrors = await ResetPassword(
      token!,
      password.value,
    );

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      navigate("/admin/distribution");
    }

    setIsLoading(false);
  };

  const getErrorMessage = (field: string) => {
    return errors[field] ? errors[field][0] : "";
  };

  const isFieldInvalid = (field: string) => {
    return !!errors[field];
  };

  useEffect(() => {
    const handleFetchVerifyToken = async () => {
      const result = await VerifyResetToken(token!);
      if (result === true) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
      }
    };

    handleFetchVerifyToken();
  }, [token, VerifyResetToken]);

  return (
    <>
      <div>
      {isTokenValid === null ? (
        <p>Verificando el token...</p>
      ) : isTokenValid ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-login">
        <Card className="p-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-card">
          <CardBody>
            <div className="text-center mb-4">
              <img src={Logo} alt="Logo" className="w-16 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold mb-2">
                Restablece tu contraseña
              </h3>
              <p className="text-gray-600">
              Ingresa tus credenciales para restablecer tu contraseña.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  name="password"
                  variant="bordered"
                  radius="lg"
                  label="Nueva Contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  isInvalid={isFieldInvalid("password")}
                  errorMessage={getErrorMessage("password")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <i className="fa-solid fa-eye"></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash"></i>
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
              </div>
              
              <div className="text-right mb-4">
                <Link
                  to="/auth/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  <i className="fa-solid fa-arrow-left"></i> Iniciar Sesión
                </Link>
              </div>
              <Button
                variant="shadow"
                isLoading={isLoading}
                isDisabled={isLoading}
                color="primary"
                type="submit"
                className="w-full"
              >
                Restablecer Contraseña
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-login">
        <Card className="p-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-card">
          <CardBody>
            <div className="text-center mb-4">
              <img src={Logo} alt="Logo" className="w-16 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold mb-2">
                Restablece tu contraseña
              </h3>
              <p className="text-gray-600">
              El token no es válido o ha expirado.
              </p>
            </div>
            <div className="text-right ">
                <Link
                  to="/auth/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  <i className="fa-solid fa-arrow-left"></i> Iniciar Sesión
                </Link>
              </div>
          </CardBody>
        </Card>
      </div>
      )}
    </div>
      
    </>
  );
};
