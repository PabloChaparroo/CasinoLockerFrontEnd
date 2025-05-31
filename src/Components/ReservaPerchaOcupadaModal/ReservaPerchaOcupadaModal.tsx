import { useEffect, useState } from "react";
import { ReservaService } from "../../Services/ReservaService";
import type { Reserva } from "../../Types/Reserva";
import { toast } from "react-toastify";
import type { ModalType } from "../../enums/ModalTypes";
import type { Percha } from "../../Types/Percha";
import { Button, Form, Modal } from "react-bootstrap";

type ReservaPerchaOcupadaProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  percha: Percha | null;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} - ${horas}:${minutos}`;
};

const ReservaPerchaOcupada = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  percha,
  refreshData,
}: ReservaPerchaOcupadaProps) => {
  const [reserva, setReserva] = useState<Reserva>();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (percha) {
          const getReserva = await ReservaService.getReservaPorPercha(percha.id);
          setReserva(getReserva);
        } else {
          console.log("Percha es null");
        }
      } catch (error) {
        toast.error('Error al cargar datos de la reserva');
      }
    };
    
    if (showModal) {
      fetchDatos();
    }
  }, [percha, showModal]);

  const handleFinalizarReserva = async () => {
    try {
      if (reserva) {
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
              <Form.Label>Número de Percha</Form.Label>
              <Form.Control type="text" value={percha?.numeroPercha || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número de Reserva</Form.Label>
              <Form.Control type="text" value={reserva.numeroReserva} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control 
                type="text" 
                value={reserva.cliente?.nombreCliente || 'Sin cliente'} 
                readOnly 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Alta</Form.Label>
              <Form.Control
                type="text"
                value={reserva.fechaAltaReserva ? formatearFecha(reserva.fechaAltaReserva) : 'Sin fecha'}
                readOnly
              /> 
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objeto</Form.Label>
              <Form.Control
                type="text"
                value={
                  reserva.objetos && reserva.objetos.length > 0 
                    ? `${reserva.objetos[0].numeroObjeto} - ${reserva.objetos[0].descripcionObjeto}`
                    : 'Sin objeto'
                }
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control 
                type="text" 
                value={reserva.estadoReserva || 'Sin estado'} 
                readOnly 
              />
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
  );
};

export default ReservaPerchaOcupada;