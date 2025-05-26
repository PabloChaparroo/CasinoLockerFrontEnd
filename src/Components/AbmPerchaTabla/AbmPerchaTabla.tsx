import React, { useEffect, useState } from 'react';
import type { Percha } from '../../Types/Percha';
import { PerchaService } from '../../Services/PerchaService';
import { toast } from 'react-toastify';
import { Button, Table, Form } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import AbmPerchaModal from '../AbmPerchaModal/AbmPerchaModal';
import RestoreButton from "../RestoreButton/RestoreButton";

const AbmPerchaTabla = () => {
  const initializableNewPercha = (): Percha => ({
    id: 0,
    numeroPercha: 0,
    fechaAltaPercha: '',
    fechaModificacionPercha: '',
    fechaBajaPercha: '',
    estadoCasilleroPercha: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState('');
  const [percha, setPercha] = useState<Percha>(initializableNewPercha);
  const [perchas, setPerchas] = useState<Percha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await PerchaService.getPerchas(showDeleted);
        setPerchas(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error('Ha ocurrido un error al cargar las perchas');
      }
    };
    fetchDatos();
  }, [refreshData, showDeleted]);

  const handleClick = (tituloModal: string, percha: Percha, modalType: ModalType) => {
    setShowModal(true);
    setModalType(modalType);
    setPercha(percha);
    setTituloModal(tituloModal);
  };

  return (
    <>
      <div className="table-container">
        <div className="table-header">
          <h4 className="table-title">ABM Perchas</h4>
          <div className="table-actions">
            <Button
              className="action-btn"
              onClick={() =>
                handleClick(
                  'Crear Percha',
                  initializableNewPercha(),
                  ModalType.CREATE
                )
              }
            >
              Nueva Percha
            </Button>
          </div>
        </div>

        <Form.Check
          type="checkbox"
          label="Mostrar perchas dadas de baja"
          checked={showDeleted}
          onChange={() => setShowDeleted(!showDeleted)}
          className="mostrar-checkbox"
        />

        {isLoading ? (
          <Loader />
        ) : (
          <div className="table-wrapper">
            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Modificación</th>
                  <th>Fecha Baja</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {perchas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.numeroPercha}</td>
                    <td>{p.fechaAltaPercha}</td>
                    <td>{p.fechaModificacionPercha}</td>
                    <td>{p.fechaBajaPercha || '-'}</td>
                    <td>{p.estadoCasilleroPercha?.nombreEstadoCasilleroPercha || '-'}</td>
                    <td>
                      <span className="me-2">
                        <EditButton
                          onClick={() =>
                            handleClick('Editar Percha', p, ModalType.UPDATE)
                          }
                        />
                      </span>
                      <span>
                        {p.fechaBajaPercha ? (
                          <RestoreButton
                            onClick={() =>
                              handleClick("Dar de Alta Percha", p, ModalType.RESTORE)
                            }
                          />
                        ) : (
                          <DeleteButton
                            onClick={() =>
                              handleClick("Dar de Baja Percha", p, ModalType.DELETE)
                            }
                          />
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {showModal && (
        <AbmPerchaModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          percha={percha}
          refreshData={setRefreshData}
        />
      )}
    </>
  );
};

export default AbmPerchaTabla;