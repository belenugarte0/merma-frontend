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
import { ISimpleBoard } from "../../interface";

interface Props {
  board: ISimpleBoard;
}

export const ViewBoardModal = ({ board }: Props) => {
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
                    label="Codigo de Placa"
                    variant="bordered"
                    isReadOnly
                    defaultValue={board.code_board}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Ubicacion"
                    variant="bordered"
                    isReadOnly
                    defaultValue={board.location}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Ancho"
                    variant="bordered"
                    isReadOnly
                    defaultValue={board.width ? String(board.width) : ""}
                    labelPlacement="outside"
                  />
                  <Input
                    label="Alto"
                    variant="bordered"
                    isReadOnly
                    defaultValue={board.height ? String(board.height) : ""}
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
