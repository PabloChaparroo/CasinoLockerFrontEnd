import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useJornada } from "../context/JornadaContext";
import { ReservaService } from "../Services/ReservaService";
import type { ReservaPendiente } from "../Types/ReservaPendiente";
import FinalizarReservaModal from "../Components/ReservaFinalizar/ReservaFinalizar";
import { toast } from "react-toastify"; // <-- Importa toast
import './FinalizarJornada.css';

const FinalizarJornada = () => {
  const navigate = useNavigate();
  const { setMostrarJornada } = useJornada();
  const [showModal, setShowModal] = useState(false);
  const [reservasPendientes, setReservasPendientes] = useState<ReservaPendiente[]>([]);

  const [showFinalizarReservaModal, setShowFinalizarReservaModal] = useState(false);
  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await ReservaService.getReservasPendientes();
        setReservasPendientes(data);
      } catch (error) {
        console.error("Error al obtener reservas pendientes:", error);
      }
    };

    fetchReservas();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleConfirmarFinalizar = () => {
    if (reservasPendientes.length > 0) {
      toast.warning("No se puede finalizar la jornada, aún quedan reservas sin finalizar."); // <-- Usar toast.warning
      return;
    }
    setMostrarJornada(false);
    setShowModal(false);
    toast.success("Jornada finalizada correctamente."); // <-- Usar toast.success
    navigate("/");
  };

  const handleAbrirFinalizarReserva = (reserva: ReservaPendiente) => {
    setReservaSeleccionadaId(reserva.id);
    setShowFinalizarReservaModal(true);
  };

  const handleAbrirObjetosPerdidos = (reserva: ReservaPendiente) => {
    toast.info(`Abrir modal de objetos perdidos para la reserva ${reserva.id} (pendiente de implementación)`);
  };

  const refrescarReservas = async () => {
    try {
      const data = await ReservaService.getReservasPendientes();
      setReservasPendientes(data);
    } catch (error) {
      console.error("Error al refrescar reservas:", error);
    }
  };

  return (
    <div className="table-container" style={{ padding: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="table-title">Reservas pendientes</h4>
        <Button
          onClick={handleShow}
          variant="danger"
          className="btn-custom-finalizar"
        >
          Finalizar
        </Button>
      </div>

      {reservasPendientes.length === 0 ? (
        <p>No hay reservas pendientes por ahora.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>N° Reserva</th>
              <th>Cliente</th>
              <th>Ubicación</th>
              <th>Cantidad de Objetos</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasPendientes.map((reserva, index) => (
              <tr key={index}>
                <td>{reserva.numeroReserva}</td>
                <td>{reserva.cliente}</td>
                <td>{reserva.ubicacion}</td>
                <td>{reserva.cantidadObjetos}</td>
                <td>{reserva.fechaAltaReserva}</td>
                <td className="d-flex gap-2 justify-content-center">
                  <Button
                    size="sm"
                    variant="danger"
                    className="btn-custom-danger"
                    onClick={() => handleAbrirFinalizarReserva(reserva)}
                  >
                    Finalizar Reserva
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    className="btn-custom-warning"
                    onClick={() => handleAbrirObjetosPerdidos(reserva)}
                  >
                    Objetos Perdidos
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Finalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas finalizar la jornada?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmarFinalizar}>
            Finalizar Jornada
          </Button>
        </Modal.Footer>
      </Modal>

      {showFinalizarReservaModal && reservaSeleccionadaId !== null && (
        <FinalizarReservaModal
          tituloModal="Finalizar Reserva"
          showModal={showFinalizarReservaModal}
          onHide={() => setShowFinalizarReservaModal(false)}
          reservaId={reservaSeleccionadaId}
          refreshData={async () => {
            const data = await ReservaService.getReservasPendientes();
            setReservasPendientes(data);
            setShowFinalizarReservaModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FinalizarJornada;