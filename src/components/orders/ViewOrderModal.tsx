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
import { ISimpleOrder } from "../../interface";

interface Props {
  order: ISimpleOrder;
}

export const ViewOrderModal = ({ order }: Props) => {
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
              <ModalHeader className="text-xl font-semibold flex flex-col gap-1">
                Ver Detalle de Orden
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Primera fila */}
                  <Input
                    label="Código de Orden"
                    variant="bordered"
                    isReadOnly
                    defaultValue={order.order_cod}
                    labelPlacement="outside"
                    className="w-full"
                  />
                  <Input
                    label="Código de Cliente"
                    variant="bordered"
                    isReadOnly
                    defaultValue={order.client_cod}
                    labelPlacement="outside"
                    className="w-full"
                  />
                  <Input
                    label="Fecha de Entrega"
                    variant="bordered"
                    isReadOnly
                    defaultValue={order.production_date}
                    labelPlacement="outside"
                    className="w-full"
                  />
                  
                  {/* Segunda fila */}
                  <Input
                    label="Cliente"
                    variant="bordered"
                    isReadOnly
                    defaultValue={order.client}
                    labelPlacement="outside"
                    className="col-span-2 w-full"
                  />
                  <Input
                    label="Producto"
                    variant="bordered"
                    isReadOnly
                    defaultValue={order.product}
                    labelPlacement="outside"
                    className="col-span-2 w-full"
                  />
                  
                  {/* Tercera fila */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Alto (mm)"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.height}
                      labelPlacement="outside"
                      className="w-full"
                    />
                    <Input
                      label="Ancho (mm)"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.width}
                      labelPlacement="outside"
                      className="w-full"
                    />
                    <Input
                      label="Profundidad (mm)"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.length}
                      labelPlacement="outside"
                      className="w-full"
                    />
                  </div>
                  
                  {/* Cuarta fila */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                      label="Tipo de Caja"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.box_type}
                      labelPlacement="outside"
                      className="w-full"
                    />
                    <Input
                      label="Tipo de Onda"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.quality}
                      labelPlacement="outside"
                      className="w-full"
                    />
                    <Input
                      label="Cantidad"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.quantity}
                      labelPlacement="outside"
                      className="w-full"
                    />
                    <Input
                      label="Colores"
                      variant="bordered"
                      isReadOnly
                      defaultValue={order.colors}
                      labelPlacement="outside"
                      className="w-full"
                    />
                  </div>
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
