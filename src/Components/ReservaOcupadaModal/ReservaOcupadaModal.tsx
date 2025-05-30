import { useEffect, useState } from "react";
import { ReservaService } from "../../Services/ReservaService";
import type { Reserva } from "../../Types/Reserva";
import { toast } from "react-toastify";
import type { ModalType } from "../../enums/ModalTypes";
import type { Casillero } from "../../Types/Casillero";
import { Button, Form, Modal } from "react-bootstrap";


type ReservaOcupadaModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  casillero: Casillero | null;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReservaOcupadaModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  casillero,
  refreshData,
}: ReservaOcupadaModalProps) => {

    const [reserva, setReserva] = useState<Reserva>();

    useEffect(() => {
        const fetchDatos = async () => {
          try {
            
           if (casillero) {
        const getReserva = await ReservaService.getReservaCasillero(casillero.id);
        setReserva(getReserva);
        //console.log("reserva", getReserva);
            } else {
        console.log("Casillero es null");
          }} catch {
            toast.error('Error al cargar datos necesarios');
          }
        };
        fetchDatos();
      }, []);
    

      //Finalizar reserva
      const handleFinalizarReserva = async () => {
    try {
      if (reserva) {
        console.log("Finalizando reserva", reserva);
        await ReservaService.finalizarReserva(reserva.id);
        toast.success('Reserva finalizada con éxito');
        onHide();
        refreshData(prevState => !prevState);
      }
    } catch (error) {
      toast.error('Error al finalizar la reserva');
    }
  };

  return (
    <Modal show={showModal} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{tituloModal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reserva ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Número de Reserva</Form.Label>
              <Form.Control type="text" value={reserva.numeroReserva} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" value={reserva.cliente?.nombreCliente || 'Sin cliente'} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Alta</Form.Label>
              <Form.Control type="text" value={reserva.fechaAltaReserva || 'Sin fecha'} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado de la Reserva</Form.Label>
              <Form.Control type="text" value={reserva.estadoReserva || 'Sin estado'} readOnly />
            </Form.Group>
          </>
        ) : (
          <p>Cargando datos de la reserva...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="danger" onClick={handleFinalizarReserva}>
          Finalizar Reserva
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReservaOcupadaModal