import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import type { Cliente } from '../../Types/Cliente';
import { ClienteService } from '../../Services/ClienteService';
import { toast } from 'react-toastify';
import ClienteModal from '../ClienteModal/ClienteModal';

const ClienteTabla = () => {
  const initializeNewCliente = (): Cliente => {
    return {
      id: 0,
      nombreCliente: '',
      dniCliente: 0,
      telefonoCliente: 0,
      mailCliente: '',
      fechaAltaCliente: null,
      fechaModificacionCliente: null,
      fechaBajaCliente: null,
    };
  };

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState('');
  const [cliente, setCliente] = useState<Cliente>(initializeNewCliente);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await ClienteService.getClientes();
        setClientes(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error('Ha ocurrido un error al cargar los clientes');
      }
    };
    fetchDatos();
  }, [refreshData]);

  const handleClick = (tituloModal: string, cliente: Cliente, modalType: ModalType) => {
    setShowModal(true);
    setModalType(modalType);
    setCliente(cliente);
    setTituloModal(tituloModal);
  };

  return (
    <>
      <div className="table-container">
        <div className="table-header">
          <h4 className="table-title">ABM Clientes</h4>
          <div className="table-actions">
            <Button
              className="action-btn"
              onClick={() =>
                handleClick('Crear Cliente', initializeNewCliente(), ModalType.CREATE)
              }
            >
              Nuevo Cliente
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="table-wrapper">
            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Modificación</th>
                  <th>Fecha Baja</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nombreCliente}</td>
                    <td>{cliente.dniCliente}</td>
                    <td>{cliente.telefonoCliente}</td>
                    <td>{cliente.mailCliente}</td>
                    <td>{cliente.fechaAltaCliente}</td>
                    <td>{cliente.fechaModificacionCliente}</td>
                    <td>{cliente.fechaBajaCliente}</td>
                    <td>
                      <span className="me-2">
                        <EditButton
                          onClick={() =>
                            handleClick('Editar Cliente', cliente, ModalType.UPDATE)
                          }
                        />
                      </span>
                      <span>
                        <DeleteButton
                          onClick={() =>
                            handleClick('Borrar Cliente', cliente, ModalType.DELETE)
                          }
                        />
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
        <ClienteModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          cliente={cliente}
          refreshData={setRefreshData}
        />
      )}
    </>
  );
};

export default ClienteTabla;
