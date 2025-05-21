import React, { useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { ModalType } from "../../enums/ModalTypes";
import Loader from "../Loader/Loader";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import RestoreButton from "../RestoreButton/RestoreButton"; // crea este componente si no lo tienes
import type { Cliente } from "../../Types/Cliente";
import { ClienteService } from "../../Services/ClienteService";
import { toast } from "react-toastify";
import ClienteModal from "../ClienteModal/ClienteModal";

const ClienteTabla = () => {
  const initializeNewCliente = (): Cliente => ({
    id: 0,
    nombreCliente: "",
    dniCliente: 0,
    telefonoCliente: 0,
    mailCliente: "",
    fechaHoraAltaCliente: null,
    fechaHoraModificacionCliente: null,
    fechaHoraBajaCliente: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [cliente, setCliente] = useState<Cliente>(initializeNewCliente);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await ClienteService.getClientes();
        setClientes(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error("Ha ocurrido un error al cargar los clientes");
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

  // Filtrar clientes según checkbox showDeleted
  const clientesFiltrados = clientes.filter((c) =>
    showDeleted ? true : !c.fechaHoraBajaCliente
  );

  return (
    <>
      <div className="table-container">
        <div className="table-header">
          <h4 className="table-title">ABM Clientes</h4>
          <div className="table-actions">
            <Button
              className="action-btn"
              onClick={() =>
                handleClick("Crear Cliente", initializeNewCliente(), ModalType.CREATE)
              }
            >
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <Form.Check
          type="checkbox"
          label="Mostrar clientes dados de baja"
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
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nombreCliente}</td>
                    <td>{cliente.dniCliente}</td>
                    <td>{cliente.telefonoCliente}</td>
                    <td>{cliente.mailCliente}</td>
                    <td>{cliente.fechaHoraAltaCliente || "-"}</td>
                    <td>{cliente.fechaHoraModificacionCliente || "-"}</td>
                    <td>{cliente.fechaHoraBajaCliente || "-"}</td>
                    <td>
                      {!cliente.fechaHoraBajaCliente ? (
                        <>
                          <EditButton
                            onClick={() =>
                              handleClick("Editar Cliente", cliente, ModalType.UPDATE)
                            }
                          />
                          <DeleteButton
                            onClick={() =>
                              handleClick("Dar de Baja Cliente", cliente, ModalType.DELETE)
                            }
                          />
                        </>
                      ) : (
                        <RestoreButton
                          onClick={() =>
                            handleClick("Dar de Alta Cliente", cliente, ModalType.RESTORE)
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <ClienteModal
        tituloModal={tituloModal}
        showModal={showModal}
        onHide={() => setShowModal(false)}
        modalType={modalType}
        cliente={cliente}
        refreshData={setRefreshData}
      />
    </>
  );
};

export default ClienteTabla;