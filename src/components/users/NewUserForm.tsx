import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useAuthStore, useRoleStore, useUserStore } from "../../stores";

export const NewUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const createUser = useUserStore((state) => state.createUser);
  const roles = useRoleStore((state) => state.roles);
  const getRoles = useRoleStore((state) => state.getRoles);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  /*LIMPIAR LOS ERROES ANTES DE ABRIR EL MODAL*/
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (roles.length === 0) getRoles(token!);
  }, [roles, getRoles, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { Name, lastname, document, email, phone, selectrole } =
      e.target as typeof e.target & {
        Name: { value: string };
        lastname: { value: string };
        document: { value: string };
        email: { value: string };
        phone: { value: string };
        selectrole: { value: string };
      };

    const validationErrors = await createUser(
      Name.value,
      lastname.value,
      document.value,
      email.value,
      phone.value,
      selectrole.value,
      token!
    );

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onClose();
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
    <>
      <Button
        onClick={onOpen}
        className="btn success"
        isIconOnly
        color="success"
        aria-label="Like"
        variant="bordered"
      >
        <i className="fas fa-plus"></i>
      </Button>
      <Modal
        size="3xl"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Nuevo Usuario
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="Name"
                    label={
                      <>
                        Nombre <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar el Nombre"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("name")}
                    errorMessage={getErrorMessage("name")}
                  />
                  <Input
                    name="lastname"
                    label={
                      <>
                        Apellido <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar el Apellido"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("lastname")}
                    errorMessage={getErrorMessage("lastname")}
                  />
                  <Input
                    name="document"
                    label={
                      <>
                        Cédula Identidad <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar la Cédula Identidad"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("document")}
                    errorMessage={getErrorMessage("document")}
                  />
                  <Input
                    name="phone"
                    label="Celular"
                    variant="bordered"
                    placeholder="Ingresar el Celular"
                    type="number"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("phone")}
                    errorMessage={getErrorMessage("phone")}
                  />
                  <Input
                    name="email"
                    label={
                      <>
                        Email <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar el Email"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("email")}
                    errorMessage={getErrorMessage("email")}
                  />
                  <Select
                    name="selectrole"
                    label={
                      <>
                        Roles <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="Selecciona un Rol"
                    isInvalid={isFieldInvalid("role")}
                    errorMessage={getErrorMessage("role")}
                  >
                    {roles.map((role) => (
                      <SelectItem key={role.name} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="shadow" color="danger" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="shadow"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  color="primary"
                  type="submit"
                >
                  Guardar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
