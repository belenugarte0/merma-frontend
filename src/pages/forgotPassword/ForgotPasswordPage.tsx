import React, { useState } from "react";
import { useAuthStore } from "../../stores";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Logo from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

export const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [email, setEmail] = useState(""); 
  const ForgotPassword = useAuthStore((state) => state.ForgotPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = await ForgotPassword(email);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setEmail(""); 
    }

    setIsLoading(false);
  };

  const getErrorMessage = (field: string) => {
    return errors[field] ? errors[field][0] : "";
  };

  const isFieldInvalid = (field: string) => {
    return !!errors[field];
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-login">
      <Card className="p-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-card">
        <CardBody>
          <div className="text-center mb-4">
            <img src={Logo} alt="Logo" className="w-16 mx-auto mb-2" />
            <h3 className="text-2xl font-semibold mb-2">¿Has olvidado tu contraseña?</h3>
            <p className="text-gray-600">
              Introduzca su correo electrónico registrado para <br /> restablecer la contraseña.
            </p>
          </div>
          <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                name="email"
                variant="bordered"
                radius="lg"
                label="Correo Electrónico"
                type="email"
                placeholder="Ingresa tu correo"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={isFieldInvalid("email")}
                errorMessage={getErrorMessage("email")}
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
              Enviar
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
