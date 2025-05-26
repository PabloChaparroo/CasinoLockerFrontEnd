import React, { useEffect, useState } from "react";
import { TipoCasilleroService } from "../../Services/TipoCasilleroService";
import type { TipoCasillero } from "../../Types/TipoCasillero";
import { toast } from "react-toastify";
import { Button, Table, Form } from "react-bootstrap";
import { ModalType } from "../../enums/ModalTypes";
import Loader from "../Loader/Loader";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton"; // para "Dar de Baja"
import RestoreButton from "../RestoreButton/RestoreButton";
import AbmTipoCasilleroModal from "../AbmTipoCasilleroModal/AbmTipoCasilleroModal";

const AbmTipoCasilleroTabla = () => {
  const initialNewTipo = (): TipoCasillero => ({
    id: 0,
    nombreTipoCasillero: "",
    fechaAltaTipoCasillero: "",
    fechaModificacionTipoCasillero: "",
    fechaBajaTipoCasillero: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(ModalType.NONE);
  const [tituloModal, setTituloModal] = useState("");
  const [tipoCasillero, setTipoCasillero] = useState<TipoCasillero>(initialNewTipo);
  const [tipos, setTipos] = useState<TipoCasillero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datos = await TipoCasilleroService.getTiposCasillero();
        setTipos(datos);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error al cargar tipos de casillero");
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, [refreshData]);

  const handleClick = (tituloModal: string, tipo: TipoCasillero, modalType: ModalType) => {
    setShowModal(true);
    setModalType(modalType);
    setTipoCasillero(tipo);
    setTituloModal(tituloModal);
  };

  // Filtrar según checkbox
  const tiposFiltrados = tipos.filter((t) =>
    showDeleted ? true : !t.fechaBajaTipoCasillero
  );

  return (
    <>
      <div className="table-container">
        <div className="table-header d-flex justify-content-between align-items-center mb-2">
          <h4 className="table-title">ABM Tipos de Casillero</h4>
          <Button
            onClick={() =>
              handleClick("Crear Tipo de Casillero", initialNewTipo(), ModalType.CREATE)
            }
          >
            Nuevo Tipo
          </Button>
        </div>

        <Form.Check
          type="checkbox"
          id="mostrar-bajas"
          label={
            <>
              Mostrar tipos dados de baja{" "}
              <i
                className={`bi ${
                  showDeleted ? "bi-check-square-fill" : "bi-square"
                }`}
                style={{ marginLeft: "6px", verticalAlign: "text-bottom" }}
              />
            </>
          }
          checked={showDeleted}
          onChange={() => setShowDeleted(!showDeleted)}
          className="mb-3"
        />

        {isLoading ? (
          <Loader />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha Alta</th>
                <th>Fecha Modificación</th>
                <th>Fecha Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposFiltrados.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nombreTipoCasillero}</td>
                  <td>{t.fechaAltaTipoCasillero || "-"}</td>
                  <td>{t.fechaModificacionTipoCasillero || "-"}</td>
                  <td>{t.fechaBajaTipoCasillero || "-"}</td>
                  <td>
                    <EditButton
                      onClick={() => handleClick("Editar Tipo de Casillero", t, ModalType.UPDATE)}
                    />
                    {t.fechaBajaTipoCasillero ? (
                      <RestoreButton
                        onClick={() => handleClick("Restaurar Tipo de Casillero", t, ModalType.RESTORE)}
                      />
                    ) : (
                      <DeleteButton
                        onClick={() => handleClick("Dar de Baja Tipo de Casillero", t, ModalType.DELETE)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {showModal && (
        <AbmTipoCasilleroModal
          tituloModal={tituloModal}
          showModal={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          tipoCasillero={tipoCasillero}
          refreshData={setRefreshData}
        />
      )}
    </>
  );
};

export default AbmTipoCasilleroTabla;