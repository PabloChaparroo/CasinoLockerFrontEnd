import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Spinner, Alert } from "react-bootstrap";
import { CasilleroService } from "../../Services/CasilleroService";
import { ReservaService } from "../../Services/ReservaService";
import { ConfObjetoPerdidoService } from "../../Services/confObjetoPerdidoService";
import type { Reserva } from "../../Types/Reserva";
import { toast } from "react-toastify";
import type { Casillero } from "../../Types/Casillero";
import type { Objeto } from "../../Types/Objeto";
import type { ReservaPendiente } from "../../Types/ReservaPendiente";

interface ObjetosPerdidosModalProps {
    showModal: boolean;
    onHide: () => void;
    reservaPendiente: ReservaPendiente;
    refreshData: () => void;
}

const ObjetosPerdidosModal: React.FC<ObjetosPerdidosModalProps> = ({ 
    showModal, 
    onHide, 
    reservaPendiente,
    refreshData 
}) => {
    const [casilleros, setCasilleros] = useState<Casillero[]>([]);
    const [selectedCasillero, setSelectedCasillero] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [objetosReserva, setObjetosReserva] = useState<Objeto[]>([]);
    const [reservaCompleta, setReservaCompleta] = useState<Reserva | null>(null);

    useEffect(() => {
        if (showModal) {
            fetchDatosReserva();
            fetchCasilleros();
        }
    }, [showModal, reservaPendiente]);

    const fetchDatosReserva = async () => {
        try {
            setLoading(true);
            const reservaData = await ReservaService.getReserva(reservaPendiente.id);
            setReservaCompleta(reservaData);
            
            if (reservaData.objetos) {
                setObjetosReserva(reservaData.objetos);
            } else {
                setObjetosReserva([]);
            }
        } catch (err) {
            setError("Error al cargar los datos de la reserva");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCasilleros = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const casillerosData = await CasilleroService.getCasillerosObjetoPerdido();
            setCasilleros(casillerosData);
        } catch (err) {
            setError("Error al cargar los casilleros");
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCasillero) {
            toast.warning("Debes seleccionar un casillero");
            return;
        }

        if (!reservaPendiente.id) {
            toast.error("No se ha podido identificar la reserva");
            return;
        }

        try {
            setLoading(true);
            await ConfObjetoPerdidoService.crearConfObjetoPerdido({
                idReserva: reservaPendiente.id,
                idCasillero: selectedCasillero
            });
            
            toast.success("Configuración de objetos perdidos creada correctamente");
            refreshData();
            onHide();
        } catch (err) {
            toast.error("Error al crear la configuración");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Objetos Perdidos - Reserva #{reservaPendiente.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <div className="text-center"><Spinner animation="border" /></div>}
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="mb-4">
                    <h5>Información de la reserva:</h5>
                    <p><strong>Cliente:</strong> {reservaPendiente.cliente}</p>
                    <p><strong>Ubicación:</strong> {reservaPendiente.ubicacion}</p>
                    <p><strong>Fecha:</strong> {reservaPendiente.fechaAltaReserva}</p>
                </div>

                <h5>Objetos de la reserva:</h5>
                {objetosReserva.length > 0 ? (
                    <Table striped bordered hover className="mb-4">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objetosReserva.map((objeto) => (
                                <tr key={objeto.id}>
                                    <td>{objeto.id}</td>
                                    <td>{objeto.descripcionObjeto || 'Sin descripción'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No hay objetos registrados en esta reserva</Alert>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Seleccionar casillero para objetos perdidos:</Form.Label>
                    <Form.Select 
                        onChange={(e) => setSelectedCasillero(Number(e.target.value))}
                        disabled={loading || casilleros.length === 0}
                        value={selectedCasillero || ""}
                    >
                        <option value="">Seleccione un casillero</option>
                        {casilleros.map((casillero) => (
                            <option key={casillero.id} value={casillero.id}>
                                Casillero #{casillero.numeroCasillero} - {casillero.tipoCasillero?.nombreTipoCasillero || 'Sin tipo'}
                            </option>
                        ))}
                    </Form.Select>
                    {casilleros.length === 0 && !loading && (
                        <Alert variant="warning" className="mt-2">No hay casilleros disponibles para objetos perdidos</Alert>
                    )}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={loading || !selectedCasillero || objetosReserva.length === 0}
                >
                    {loading ? <Spinner as="span" size="sm" animation="border" /> : 'Guardar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ObjetosPerdidosModal;