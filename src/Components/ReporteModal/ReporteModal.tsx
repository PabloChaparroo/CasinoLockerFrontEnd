import { Modal, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import type { ReservaReporte } from "../../Types/ReservaReporte";
import type { ReservaClienteReporte } from "../../Types/ReservaClienteReporte";

interface ReporteModalProps {
  show: boolean;
  onClose: () => void;
  desde: string;
  hasta: string;
  reservas: ReservaReporte[];
  reservasCliente: ReservaClienteReporte[];
  chartData: any;
  tipoReporte: string;
}

const formatDate = (fecha: string) => {
  const [yyyy, mm, dd] = fecha.split("T")[0].split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const ReporteModal = ({
  show,
  onClose,
  desde,
  hasta,
  reservas,
  reservasCliente,
  chartData,
  tipoReporte
}: ReporteModalProps) => {
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          {tipoReporte === "cliente"
            ? "Informe de reservas por cliente"
            : "Informe de reservas por fecha"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha del informe desde:</strong> {formatDate(desde)}</p>
        <p><strong>Fecha del informe hasta:</strong> {formatDate(hasta)}</p>
        <p><strong>Cantidad total de Reservas entre las fechas indicadas:</strong> {tipoReporte === "fechas" ? reservas.length : reservasCliente.length}</p>

        {tipoReporte === "fechas" && reservas.length > 0 && (
          <>
            <h5 className="mt-4">Gráfico de Reservas por Fecha</h5>
            <Bar data={chartData} className="mb-4" />
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#Reserva</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Finalización</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.numeroReserva}>
                    <td>{r.numeroReserva}</td>
                    <td>{r.cliente}</td>
                    <td>{r.estado}</td>
                    <td>{r.ubicacion}</td>
                    <td>{r.fechaHoraAlta}</td>
                    <td>{r.fechaHoraFinalizacion}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {tipoReporte === "cliente" && reservasCliente.length > 0 && (
          <>
            <h5 className="mt-4">Reservas del Cliente</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Finalización</th>
                  <th>Objetos</th>
                </tr>
              </thead>
              <tbody>
                {reservasCliente.map((reserva, index) => (
                  <tr key={index}>
                    <td>{reserva.nombreCliente}</td>
                    <td>{reserva.ubicacion}</td>
                    <td>{reserva.estadoReserva}</td>
                    <td>{reserva.fechaHoraInicio}</td>
                    <td>{reserva.fechaHoraFinalizacion}</td>
                    <td>
                      <ul style={{ marginBottom: 0 }}>
                        {reserva.objetos.map(obj => (
                          <li key={obj.numeroObjeto}>
                            #{obj.numeroObjeto} - {obj.descripcionObjeto}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReporteModal;