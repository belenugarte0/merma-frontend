import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Input
} from "@nextui-org/react";

import { useAuthStore, useBoardStore } from "../../stores";

export const NewBoardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const createBoard = useBoardStore((state) => state.createBoard);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  /*LIMPIAR LOS ERROES ANTES DE ABRIR EL MODAL*/
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { code_board, location, width, height } =
      e.target as typeof e.target & {
        code_board: { value: string };
        location: { value: string };
        width: { value: number };
        height: { value: number };
      };

    const validationErrors = await createBoard(
      code_board.value,
      location.value,
      width.value,
      height.value,
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
                Registrar Nuevo Conductor
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="code_board"
                    label={
                      <>
                        Codigo de Placa <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar el codigo de la Placa"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("code_board")}
                    errorMessage={getErrorMessage("code_board")}
                  />
                  <Input
                    name="location"
                    label={
                      <>
                        Ubicacion <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Ingresar Ubicacion de la Placa"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("location")}
                    errorMessage={getErrorMessage("location")}
                  />
                  <Input
                    name="width"
                    label="width"
                    variant="bordered"
                    placeholder="Ingresar el Ancho de la Placa"
                    type="number"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("width")}
                    errorMessage={getErrorMessage("width")}
                  />
                  <Input
                    name="height"
                    label="height"
                    variant="bordered"
                    placeholder="Ingresar el Ancho de la Placa"
                    type="number"
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("height")}
                    errorMessage={getErrorMessage("height")}
                  /> 
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
