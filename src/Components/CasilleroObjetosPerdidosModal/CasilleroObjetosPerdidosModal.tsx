import type { ConfObjetoPerdidoDetalle } from "../../Types/ConfObjetoPerdidoDetalle";
import "./ObjetoPerdidoModal.css";
import { toast } from "react-toastify";
import { ConfObjetoPerdidoService } from "../../Services/confObjetoPerdidoService";

interface Props {
  detalle: ConfObjetoPerdidoDetalle;
  onClose: () => void;
}

const ObjetoPerdidoModal = ({ detalle, onClose }: Props) => {
  const handleRetirarReserva = async (idReserva: number) => {
    try {
      await ConfObjetoPerdidoService.despacharReserva(idReserva);
      toast.success("Reserva retirada correctamente");

      // Opcional: podés hacer una recarga de datos en lugar de cerrar
      onClose();
    } catch (error) {
      toast.error("Error al retirar la reserva");
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-custom-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="modal-title">Reservas en este Casillero</h2>

        {detalle.reservas.map((reserva, index) => (
          <div key={index} className="reserva-card shadow-sm">
            <div className="reserva-info">
              <p><strong>Reserva </strong></p>
              <p><strong>Cliente:</strong> {reserva.clienteNombre}</p>
              <p><strong>Ubicación:</strong> {reserva.ubicacion}</p>
              <p><strong>Fecha y hora:</strong> {reserva.fechaHoraReserva}</p>
            </div>

            <div className="objetos-list">
              <h5>Objetos:</h5>
              <ul>
                {reserva.objetos.map((obj, i) => (
                  <li key={i}>
                    <strong>#{obj.numeroObjeto}</strong>: {obj.descripcionObjeto}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reserva-actions">
              <button
                className="accion-btn danger"
                onClick={() => handleRetirarReserva(reserva.idReserva)}
              >
                Retirar reserva
              </button>
              <button className="accion-btn secondary">Notificar Cliente</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjetoPerdidoModal;