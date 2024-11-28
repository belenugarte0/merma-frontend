import React, { useState, useEffect } from "react";
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
import { useAuthStore, useUserStore, useRoleStore } from "../../stores";
import { ISimpleUser } from "../../interface";

interface Props {
  user: ISimpleUser;
}

export const EditUserModal = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    user.role
  );
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const updateUser = useUserStore((state) => state.updateUser);
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

  useEffect(() => {
    setSelectedRole(user.role);
  }, [user]);

  
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

    const validationErrors = await updateUser(
      user.id,
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
      setErrors({});
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
        className="btn bprimary"
        isIconOnly
        color="primary"
        aria-label="Like"
        variant="bordered"
        
      >
        <i className="fa-solid fa-pencil"></i>
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
                Editar Usuario
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
                    placeholder="Modifica Nombre"
                    defaultValue={user.name}
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
                    placeholder="Modifica Apellido"
                    defaultValue={user.lastname}
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
                    placeholder="Modifica Cédula Identidad"
                    defaultValue={user.document}
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("document")}
                    errorMessage={getErrorMessage("document")}
                  />
                  <Input
                    name="phone"
                    label="Celular"
                    variant="bordered"
                    placeholder="Modifica Celular"
                    type="number"
                    defaultValue={user.phone || ""}
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
                    type="email"
                    variant="bordered"
                    placeholder="Modifica Email"
                    defaultValue={user.email}
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
                    defaultSelectedKeys={[selectedRole || ""]}
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
