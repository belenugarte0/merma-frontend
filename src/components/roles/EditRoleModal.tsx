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
  Card,
  CardHeader,
  Divider,
  CardBody,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { useAuthStore, useRoleStore } from "../../stores";
import { usePermissionStore } from "../../stores/permissions/permissions.store";
import { ISimpleRole } from "../../interface/roles/simple-role";

interface Props {
  role: ISimpleRole;
}

export const EditRoleModal = ({ role }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const updateRole = useRoleStore((state) => state.updateRole);
  const permissions = usePermissionStore((state) => state.permissions);
  const getPermissions = usePermissionStore((state) => state.getPermissions);

  const { isOpen, onOpen, onClose } = useDisclosure();
  /*ABRIR MODAL */
  const handleOpen = () => {
    setSelectedPermissions(
      role.permissions.map((permission) => permission.name)
    );
    onOpen();
  };

  /*LIMPIAR LOS ERROES ANTES DE ABRIR EL MODAL*/
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedPermissions(
      role.permissions.map((permission) => permission.name)
    );
    getPermissions(token!);
  }, [role.permissions, token, getPermissions]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { Name } = e.target as HTMLFormElement;
    const validationErrors = await updateRole(
      role.id,
      Name.value,
      selectedPermissions,
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

  const handleCheckboxChange = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const { grupo } = permission;
    if (!acc[grupo]) {
      acc[grupo] = [];
    }
    acc[grupo].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const getErrorMessage = (field: string) => {
    return errors[field] ? errors[field][0] : "";
  };

  const isFieldInvalid = (field: string) => {
    return !!errors[field];
  };
  return (
    <>
      <Button
        onClick={handleOpen}
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
        onClose={onClose}
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Editar Rol
            </ModalHeader>
            <ModalBody>
              <Input
                name="Name"
                label={
                  <>
                    Descripción del Rol
                    <span className="text-red-500"> *</span>
                  </>
                }
                variant="bordered"
                placeholder="Nombre"
                defaultValue={role.name}
                labelPlacement="outside"
                isInvalid={isFieldInvalid("name")}
                errorMessage={getErrorMessage("name")}
              />
              <Divider />
              <h4 className="text-small leading-none text-default-600">
                Permisos <span className="text-red-500"> * </span>
                {errors.permissions && (
                  <span className="text-danger"> {errors.permissions[0]}</span>
                )}
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(groupedPermissions).map((grupo) => (
                  <Card
                    key={grupo}
                    className="border border-gray-300 rounded-lg shadow-lg transform transition duration-200 ease-in-out hover:shadow-2xl hover:border-blue-500 hover:scale-105"
                    style={{
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      padding: '10px',
                      transition: 'box-shadow 0.3s ease-in-out',
                    }}
                  >
                    <CardHeader
                      className="px-4 py-2 text-gray-800 font-semibold"
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'color 0.3s ease-in-out',
                      }}
                    >
                      {grupo}
                    </CardHeader>
                    <Divider />
                    <CardBody className="bg-white p-4">
                      <CheckboxGroup defaultValue={selectedPermissions}>
                        {groupedPermissions[grupo].map((permission) => (
                          <Checkbox
                            key={permission.id}
                            value={permission.name}
                            onChange={() => handleCheckboxChange(permission.name)}
                            className="text-gray-700 font-medium transition duration-150 hover:text-blue-500"
                          >
                            {permission.name}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </CardBody>
                  </Card>
                ))}
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
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
