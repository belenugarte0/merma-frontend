import React, { useState } from "react";
import { useAuthStore } from "../../stores";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import Logo from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const { email, password } = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    // Reset errors
    setErrors({ email: "", password: "" });

    let hasErrors = false;
    if (email.value.trim() === "") {
      setErrors((prev) => ({ ...prev, email: "Correo es obligatorio" }));
      hasErrors = true;
    }
    if (password.value.trim() === "") {
      setErrors((prev) => ({ ...prev, password: "Contraseña es obligatoria" }));
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    await login(email.value, password.value);
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-login">
      <Card className="p-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-card">
        <CardBody>
          <div className="text-center mb-4">
            <img src={Logo} alt="Logo" className="w-16 mx-auto mb-2" />
            <h3 className="text-2xl font-semibold mb-2">Iniciar Sesión</h3>
            <p className="text-gray-600">
              Bienvenido, inicia sesión con tu correo electrónico
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
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
            </div>
            <div className="mb-4">
              <Input
                name="password"
                variant="bordered"
                radius="lg"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
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
                isInvalid={!!errors.password}
                errorMessage={errors.password}
              />
            </div>
            <div className="text-right mb-4">
              <Link
                to="/forgot_password"
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
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
              Acceso
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
