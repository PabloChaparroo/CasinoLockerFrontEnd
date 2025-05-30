import React, { useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { ModalType } from "../../enums/ModalTypes";
import Loader from "../Loader/Loader";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import RestoreButton from "../RestoreButton/RestoreButton";
import type { Usuario } from "../../Types/Usuario";

import { toast } from "react-toastify";
import AbmUsuarioModal from "../AbmUsuarioModal/AbmUsuarioModal";
import { UsuarioService } from "../../Services/UsuarioService";
import type { UsuarioTablaDTO } from "../../Types/UsuarioTablaDTO";


const initializeNewUsuario = (): Usuario => ({
  id: 0,
  nombreUsuario: "",
  dniUsuario: 0,
  telefonoUsuario: 0,
  emailUsuario: "",
  descripcionUsuario: "",
  fechaAltaUsuario: null,
  fechaBajaUsuario: null,
  fechaModificacionUsuario: null,
  estadoUsuario: null,

});



const AbmUsuarioTabla = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [usuario, setUsuario] = useState<Usuario>(initializeNewUsuario);
  //const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioTablaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await UsuarioService.getUsuarios();
        setUsuarios(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error("Ha ocurrido un error al cargar los usuarios");
      }
    };
    fetchDatos();
  }, [refreshData]);

  const handleClick = (tituloModal: string, usuario: Usuario, modalType: ModalType) => {
    setShowModal(true);
    setModalType(modalType);
    setUsuario(usuario);
    setTituloModal(tituloModal);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    showDeleted ? true : !u.fechaBajaUsuario
  );

  return (
    <>
      <div className="table-container">
        <div className="table-header">
          <h4 className="table-title">ABM Usuarios</h4>
          <div className="table-actions">
            <Button
              className="action-btn"
              onClick={() =>
                handleClick("Crear Usuario", initializeNewUsuario(), ModalType.CREATE)
              }
            >
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <Form.Check
          type="checkbox"
          label="Mostrar usuarios dados de baja"
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
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Rol</th>
                  <th>Fecha Alta</th>
                  <th>Fecha Modificación</th>
                  <th>Fecha Baja</th> 
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombreUsuario}</td>
                    <td>{usuario.dniUsuario}</td>
                    <td>{usuario.telefonoUsuario}</td>
                    <td>{usuario.emailUsuario}</td>
                    <td>{usuario.descripcionUsuario}</td>
                    <td>{usuario.estadoUsuario || "-"}</td>
                    <td>
                      {usuario.role === "ADMIN"
                        ? "Administrador"
                        : usuario.role === "EMPLEADO"
                        ? "Empleado"
                        : "-"}
                    </td>
                    <td>{usuario.fechaAltaUsuario || "-"}</td>
                    <td>{usuario.fechaModificacionUsuario || "-"}</td>
                    <td>{usuario.fechaBajaUsuario || "-"}</td>
                    <td>
                      {!usuario.fechaBajaUsuario ? (
                        <>
                          <EditButton
                            onClick={() =>
                              handleClick("Editar Usuario", usuario, ModalType.UPDATE)
                            }
                          />
                          <DeleteButton
                            onClick={() =>
                              handleClick("Dar de Baja Usuario", usuario, ModalType.DELETE)
                            }
                          />
                        </>
                      ) : (
                        <RestoreButton
                          onClick={() =>
                            handleClick("Dar de Alta Usuario", usuario, ModalType.RESTORE)
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

      <AbmUsuarioModal
        tituloModal={tituloModal}
        showModal={showModal}
        onHide={() => setShowModal(false)}
        modalType={modalType}
        usuario={usuario}
        refreshData={setRefreshData}
      />
    </>
  );
};

export default AbmUsuarioTabla;