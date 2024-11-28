import React, { useState, useEffect } from "react";
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
import { ISimpleBoard } from "../../interface";

interface Props {
  board: ISimpleBoard;
}

export const EditBoardModal = ({ board }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const updateBoard = useBoardStore((state) => state.updateBoard);

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

    const validationErrors = await updateBoard(
      board.id,
      code_board.value,
      location.value,
      width.value,
      height.value,
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
                Editar Conductores
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
                    placeholder="Modifica el Codigo de la Placa"
                    defaultValue={board.code_board}
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
                    placeholder="Modifica la Ubicacion"
                    defaultValue={board.location}
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("location")}
                    errorMessage={getErrorMessage("location")}
                  />
                  <Input
                    name="width"
                    label="Ancho"
                    variant="bordered"
                    placeholder="Modifica el ancho"
                    type="number"
                    defaultValue={board.width ? String(board.width) : ""}
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("width")}
                    errorMessage={getErrorMessage("width")}
                  />

                  <Input
                    name="height"
                    label="Alto"
                    variant="bordered"
                    placeholder="Modifica el alto"
                    type="number"
                    defaultValue={board.height ? String(board.height) : ""}
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
