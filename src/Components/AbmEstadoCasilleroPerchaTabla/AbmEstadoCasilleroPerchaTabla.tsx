import React, { useEffect, useState } from 'react';
import type { EstadoCasilleroPercha } from '../../Types/EstadoCasilleroPercha';
import { EstadoCasilleroPerchaService } from '../../Services/EstadoCasilleroPerchaService';
import { toast } from 'react-toastify';
import { Button, Table, Form } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import RestoreButton from '../RestoreButton/RestoreButton';
import AbmEstadoCasilleroPerchaModal from '../AbmEstadoCasilleroPerchaModal/AbmEstadoCasilleroPerchaModal';
import './AbmEstadoCasilleroPerchaTabla.css';

const AbmEstadoCasilleroPerchaTabla = () => {
  const initializableNewEstadoCasilleroPercha = (): EstadoCasilleroPercha => ({
    id: 0,
    nombreEstadoCasilleroPercha: "",
    fechaAltaEstadoCasilleroPercha: "",
    fechaModificacionEstadoCasilleroPercha: "",
    fechaBajaEstadoCasilleroPercha: "",
    colorEstadoCasilleroPercha: "#000000",
    reservable: false
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [estadoCasilleroPercha, setEstadoCasilleroPercha] = useState<EstadoCasilleroPercha>(initializableNewEstadoCasilleroPercha);
  const [estadosCasilleroPercha, setEstadosCasilleroPercha] = useState<EstadoCasilleroPercha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [verDadosDeBaja, setVerDadosDeBaja] = useState(false);

  const fetchDatos = async () => {
    try {
      const datos = await EstadoCasilleroPerchaService.getEstados();
      setEstadosCasilleroPercha(datos);
    } catch (error) {
      toast.error("Ha ocurrido un error al cargar los estados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [refreshData]);

  const handleClick = (tituloModal: string, estado: EstadoCasilleroPercha, modal: ModalType) => {
    setShowModal(true);
    setModalType(modal);
    setEstadoCasilleroPercha(estado);
    setTituloModal(tituloModal);
  };

  const estadosFiltrados = estadosCasilleroPercha.filter(estado =>
    verDadosDeBaja ? true : estado.fechaBajaEstadoCasilleroPercha === null
  );

  return (
    <>
      <div className="table-container">
        <div className="table-header d-flex justify-content-between align-items-center mb-2">
          <h4 className="table-title">ABM Estado Casillero/Percha</h4>
          <Button
            className="action-btn"
            onClick={() =>
              handleClick("Crear Estado", initializableNewEstadoCasilleroPercha(), ModalType.CREATE)
            }
          >
            Nuevo Estado
          </Button>
        </div>

        <div className="checkbox-container mb-3">
          <Form.Check
            type="checkbox"
            id="verDadosDeBaja"
            label="Ver dados de baja"
            checked={verDadosDeBaja}
            onChange={() => setVerDadosDeBaja(prev => !prev)}
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="table-wrapper">
            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Estado</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Modificación</th>
                  <th>Fecha Baja</th>
                  <th>Color</th>
                  <th>Reservable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estadosFiltrados.map((estado) => (
                  <tr key={estado.id}>
                    <td>{estado.id}</td>
                    <td>{estado.nombreEstadoCasilleroPercha}</td>
                    <td>{estado.fechaAltaEstadoCasilleroPercha}</td>
                    <td>{estado.fechaModificacionEstadoCasilleroPercha}</td>
                    <td>{estado.fechaBajaEstadoCasilleroPercha || "-"}</td>
                    <td>
                      <div
                        className="color-box"
                        style={{ backgroundColor: estado.colorEstadoCasilleroPercha }}
                        title={estado.colorEstadoCasilleroPercha}
                      />
                    </td>
                    <td>{estado.reservable ? "Sí" : "No"}</td>
                    <td>
                      {estado.fechaBajaEstadoCasilleroPercha ? (
                        // Aquí cambiamos ModalType.RESTORE por ModalType.DELETE para abrir modal confirmación restaurar
                        <RestoreButton onClick={() => handleClick("Restaurar estado", estado, ModalType.DELETE)} />
                      ) : (
                        <>
                          <span className="me-2">
                            <EditButton onClick={() => handleClick("Editar estado", estado, ModalType.UPDATE)} />
                          </span>
                          <span>
                            <DeleteButton onClick={() => handleClick("Borrar estado", estado, ModalType.DELETE)} />
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {showModal && (
        <AbmEstadoCasilleroPerchaModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          estadoCasilleroPercha={estadoCasilleroPercha}
          refreshData={setRefreshData}
        />
      )}
    </>
  );
};

export default AbmEstadoCasilleroPerchaTabla;
