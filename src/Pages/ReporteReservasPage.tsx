import { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { ReservaService } from "../Services/ReservaService";
import { ClienteService } from "../Services/ClienteService";
import type { ReservaReporte } from "../Types/ReservaReporte";
import type { Cliente } from "../Types/Cliente";
import type { ReservaClienteReporte } from "../Types/ReservaClienteReporte";
import ReporteModal from "../Components/ReporteModal/ReporteModal";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./ObjetosPerdidosPage.css";

Chart.register(...registerables);

const ReporteReservasPage = () => {
  const [tipoReporte, setTipoReporte] = useState("fechas");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [reservas, setReservas] = useState<ReservaReporte[]>([]);
  const [reservasCliente, setReservasCliente] = useState<ReservaClienteReporte[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  useEffect(() => {
    ClienteService.getClientes().then(setClientes).catch(() => alert("Error al cargar clientes"));
  }, []);

  useEffect(() => {
    if (busquedaCliente.trim() === "") {
      ClienteService.getClientes().then(setClientes).catch(() => alert("Error al cargar clientes"));
    } else {
      ClienteService.buscarClientesPorNombre(busquedaCliente)
        .then(setClientes)
        .catch(() => alert("Error al buscar clientes"));
    }
  }, [busquedaCliente]);

  const generarReporte = async () => {
    try {
      if (tipoReporte === "fechas") {
        const data = await ReservaService.getReservasEntreFechas(desde, hasta);
        setReservas(data);
        setReservasCliente([]);
        setShowModal(true);
      } else if (tipoReporte === "cliente" && clienteSeleccionado !== null) {
        const data = await ReservaService.getReservasPorCliente(clienteSeleccionado, desde, hasta);
        setReservasCliente(data);
        setReservas([]);
        setShowModal(true);
      } else {
        alert("Debe seleccionar un cliente");
      }
    } catch {
      alert("Error al generar reporte");
    }
  };

  const parseFecha = (fechaStr: string) => {
    const [dia, mes, anio] = fechaStr.split("/").map(Number);
    return new Date(anio, mes - 1, dia);
  };

  const reservasPorFecha: { [key: string]: number } = {};
  if (tipoReporte === "fechas") {
    reservas.forEach(r => {
      const fechaTexto = r.fechaHoraAlta.split(" - ")[0];
      reservasPorFecha[fechaTexto] = (reservasPorFecha[fechaTexto] || 0) + 1;
    });
  }

  const fechas = Object.keys(reservasPorFecha);
  fechas.sort((a, b) => parseFecha(a).getTime() - parseFecha(b).getTime());

  const chartData = {
    labels: fechas,
    datasets: [
      {
        label: "Reservas",
        backgroundColor: "#007bff",
        data: fechas.map(fecha => reservasPorFecha[fecha]),
      }
    ]
  };

  return (
    <div className="objetos-container">
      <div className="header-section">
        <h2 className="page-title">Reporte de Reservas</h2>
      </div>

      <div className="page-container">
        <h3>Generar reportes</h3>
        <br />
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group controlId="tipoReporte" className="mb-3">
            <Form.Label>Tipo de Informe</Form.Label>
            <Form.Select value={tipoReporte} onChange={e => setTipoReporte(e.target.value)}>
              <option value="fechas">Reporte por fechas</option>
              <option value="cliente">Reporte por cliente</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="desde">
            <Form.Label>Desde</Form.Label>
            <Form.Control type="datetime-local" value={desde} onChange={e => setDesde(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="hasta" className="mt-2">
            <Form.Label>Hasta</Form.Label>
            <Form.Control type="datetime-local" value={hasta} onChange={e => setHasta(e.target.value)} />
          </Form.Group>

          {tipoReporte === "cliente" && (
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group controlId="clienteSelect">
                  <Form.Label>Seleccionar Cliente</Form.Label>
                  <Form.Select
                    value={clienteSeleccionado ?? ""}
                    onChange={e => setClienteSeleccionado(Number(e.target.value) || null)}
                  >
                    <option value="">-- Seleccione un cliente --</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombreCliente}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="buscarCliente">
                  <Form.Label>Buscar Cliente por Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escriba para buscar..."
                    value={busquedaCliente}
                    onChange={e => setBusquedaCliente(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && e.preventDefault()}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Button className="mt-3" type="button" onClick={generarReporte}>
            Generar
          </Button>
        </Form>
      </div>

      <ReporteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        desde={desde}
        hasta={hasta}
        reservas={reservas}
        reservasCliente={reservasCliente}
        chartData={chartData}
        tipoReporte={tipoReporte}
      />
    </div>
  );
};

export default ReporteReservasPage;