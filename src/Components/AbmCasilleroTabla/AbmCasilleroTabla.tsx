import React, { useEffect, useState } from 'react';
import type { Casillero } from '../../Types/Casillero';
import { CasilleroService } from '../../Services/CasilleroService';
import { toast } from 'react-toastify';
import { Button, Table, Form } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import AbmCasilleroModal from '../AbmCasilleroModal/AbmCasilleroModal';
import RestoreButton from "../RestoreButton/RestoreButton";


const AbmCasilleroTabla = () => {
  const initializableNewCasillero = (): Casillero => ({
    id: 0,
    numeroCasillero: 0,
    fechaAltaCasillero: null,
    fechaBajaCasillero: null,
    fechaModificacionCasillero: null,
    tipoCasillero: null,
    estadoCasilleroPercha: null
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState('');
  const [casillero, setCasillero] = useState<Casillero>(initializableNewCasillero);
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await CasilleroService.getCasilleros();
        setCasilleros(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error('Ha ocurrido un error al cargar los casilleros');
      }
    };
    fetchDatos();
  }, [refreshData]);

  const handleClick = (tituloModal: string, casillero: Casillero, modalType: ModalType) => {
    setShowModal(true);
    setModalType(modalType);
    setCasillero(casillero);
    setTituloModal(tituloModal);
  };

  const casillerosFiltrados = casilleros.filter(c =>
    showDeleted ? true : !c.fechaBajaCasillero
  );

  return (
    <>
      <div className="table-container">
        <div className="table-header">
          <h4 className="table-title">ABM Casilleros</h4>
          <div className="table-actions">
            <Button
              className="action-btn"
              onClick={() =>
                handleClick(
                  'Crear Casillero',
                  initializableNewCasillero(),
                  ModalType.CREATE
                )
              }
            >
              Nuevo Casillero
            </Button>
          </div>
        </div>

        <Form.Check
          type="checkbox"
          label="Mostrar casilleros dados de baja"
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
                  <th>Tipo</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Modificación</th>
                  <th>Fecha Baja</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {casillerosFiltrados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.numeroCasillero}</td>
                    <td>{c.tipoCasillero?.nombreTipoCasillero || '-'}</td>
                    <td>{c.fechaAltaCasillero || '-'}</td>
                    <td>{c.fechaModificacionCasillero || '-'}</td>
                    <td>{c.fechaBajaCasillero || '-'}</td>
                    <td>{c.estadoCasilleroPercha?.nombreEstadoCasilleroPercha || '-'}</td>
                    <td>
                      <span className="me-2">
                        <EditButton
                          onClick={() =>
                            handleClick('Editar Casillero', c, ModalType.UPDATE)
                          }
                        />
                      </span>
                      <span>
                        {c.fechaBajaCasillero ? (
                          <RestoreButton
                            onClick={() =>
                              handleClick("Dar de Alta Casillero", c, ModalType.RESTORE)
                            }
                          />
                        ) : (
                          <DeleteButton
                            onClick={() =>
                              handleClick("Dar de Baja Casillero", c, ModalType.DELETE)
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
        <AbmCasilleroModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          casillero={casillero}
          refreshData={setRefreshData}
        />
      )}
    </>
  );
};

export default AbmCasilleroTabla;