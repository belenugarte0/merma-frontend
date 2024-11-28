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
import { useAuthStore, useMoldStore } from "../../stores";
import { ISimpleMold } from "../../interface";

interface Props {
  mold: ISimpleMold;
}

export const EditMoldModal = ({ mold }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const token = useAuthStore((state) => state.token);
  const updateMold = useMoldStore((state) => state.updateMold);

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
    const { code_mold, name_mold, width, height } =
      e.target as typeof e.target & {
        code_mold: { value: string };
        name_mold: { value: string };
        width: { value: number };
        height: { value: number };
      };

    const validationErrors = await updateMold(
      mold.id,
      code_mold.value,
      name_mold.value,
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
                    name="code_mold"
                    label={
                      <>
                        Codigo de Molde <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Modifica el Codigo del Molde"
                    defaultValue={mold.code_mold}
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("code_mold")}
                    errorMessage={getErrorMessage("code_mold")}
                  />
                  <Input
                    name="name_mold"
                    label={
                      <>
                        Nombre de Molde <span className="text-red-500">*</span>
                      </>
                    }
                    variant="bordered"
                    placeholder="Modifica el Nombre de Molde"
                    defaultValue={mold.name_mold}
                    labelPlacement="outside"
                    isInvalid={isFieldInvalid("name_mold")}
                    errorMessage={getErrorMessage("name_mold")}
                  />
                  <Input
                    name="width"
                    label="Ancho"
                    variant="bordered"
                    placeholder="Modifica el ancho"
                    type="number"
                    defaultValue={mold.width ? String(mold.width) : ""}
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
                    defaultValue={mold.height ? String(mold.height) : ""}
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
