import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { ISimpleMold } from "../../interface";

interface Props {
  mold: ISimpleMold;
}

export const ViewMoldModal = ({ mold }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        className="btn bsecondary"
        isIconOnly
        aria-label="Like"
        variant="bordered"
      >
        <i className="fa-solid fa-eye"></i>
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ver Usuario
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Codigo de Molde"
                    variant="bordered"
                    isReadOnly
                    defaultValue={mold.code_mold}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Nombre de Molde"
                    variant="bordered"
                    isReadOnly
                    defaultValue={mold.name_mold}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Ancho"
                    variant="bordered"
                    isReadOnly
                    defaultValue={mold.width ? String(mold.width) : ""}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Alto"
                    variant="bordered"
                    isReadOnly
                    defaultValue={mold.height ? String(mold.height) : ""}
                    labelPlacement="outside"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="shadow" color="danger" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
