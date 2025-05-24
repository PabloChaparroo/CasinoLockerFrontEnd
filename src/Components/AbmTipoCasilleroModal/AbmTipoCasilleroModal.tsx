import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { TipoCasilleroService } from "../../Services/TipoCasilleroService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, Modal } from "react-bootstrap";
import type { TipoCasillero } from "../../Types/TipoCasillero";

type TipoCasilleroCreate = Omit<
  TipoCasillero,
  | "id"
  | "fechaAltaTipoCasillero"
  | "fechaModificacionTipoCasillero"
  | "fechaBajaTipoCasillero"
>;
type TipoCasilleroUpdate = TipoCasillero;

type TipoCasilleroModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  tipoCasillero: TipoCasillero;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AbmTipoCasilleroModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  tipoCasillero,
  refreshData,
}: TipoCasilleroModalProps) => {
  const validationSchema = Yup.object().shape({
    nombreTipoCasillero: Yup.string().required("El nombre es requerido"),
  });

  const initialValues = useMemo(() => {
    if (modalType === ModalType.CREATE) {
      return {
        nombreTipoCasillero: "",
      };
    } else {
      return {
        id: tipoCasillero.id,
        nombreTipoCasillero: tipoCasillero.nombreTipoCasillero,
        // Aunque los valores están acá, no se mostrarán en el formulario
        fechaAltaTipoCasillero: tipoCasillero.fechaAltaTipoCasillero ?? "",
        fechaModificacionTipoCasillero:
          tipoCasillero.fechaModificacionTipoCasillero ?? "",
        fechaBajaTipoCasillero: tipoCasillero.fechaBajaTipoCasillero ?? "",
      };
    }
  }, [modalType, tipoCasillero]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (modalType === ModalType.CREATE) {
        const dataToSend: TipoCasilleroCreate = {
          nombreTipoCasillero: values.nombreTipoCasillero,
        };
        handleCreate(dataToSend);
      } else {
        const dataToSend: TipoCasilleroUpdate = {
          id: values.id!,
          nombreTipoCasillero: values.nombreTipoCasillero,
          fechaAltaTipoCasillero: values.fechaAltaTipoCasillero,
          fechaModificacionTipoCasillero: new Date()
            .toISOString()
            .split("T")[0],
          fechaBajaTipoCasillero: values.fechaBajaTipoCasillero,
        };
        handleUpdate(dataToSend);
      }
    },
  });

  const handleCreate = async (data: TipoCasilleroCreate) => {
    try {
      await TipoCasilleroService.createTipoCasillero(data);
      toast.success("Tipo de casillero creado con éxito");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear tipo de casillero");
    }
  };

  const handleUpdate = async (data: TipoCasilleroUpdate) => {
    try {
      await TipoCasilleroService.updateTipoCasillero(data.id, data);
      toast.success("Tipo de casillero actualizado con éxito");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar tipo de casillero");
    }
  };

  const handleDarDeBaja = async () => {
    try {
      await TipoCasilleroService.bajaTipoCasillero(tipoCasillero.id);
      toast.success("Tipo de casillero dado de baja");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al dar de baja");
    }
  };

  const handleRestaurar = async () => {
    try {
      await TipoCasilleroService.restaurarTipoCasillero(tipoCasillero.id);
      toast.success("Tipo de casillero restaurado");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al restaurar");
    }
  };

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={showModal} centered backdrop="static">
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea dar de baja el tipo de casillero?
              <br />
              <strong>{tipoCasillero.nombreTipoCasillero}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDarDeBaja}>
              Dar de Baja
            </Button>
          </Modal.Footer>
        </Modal>
      ) : modalType === ModalType.RESTORE ? (
        <Modal show={showModal} centered backdrop="static">
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea restaurar el tipo de casillero?
              <br />
              <strong>{tipoCasillero.nombreTipoCasillero}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleRestaurar}>
              Restaurar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={showModal} centered backdrop="static">
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              {/* Hidden ID para UPDATE */}
              {modalType === ModalType.UPDATE && (
                <Form.Control type="hidden" name="id" value={formik.values.id} />
              )}

              <Form.Group controlId="nombreTipoCasillero" className="mt-3">
                <Form.Label>Nombre del tipo de casillero:</Form.Label>
                <Form.Control
                  name="nombreTipoCasillero"
                  type="text"
                  value={formik.values.nombreTipoCasillero}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.nombreTipoCasillero &&
                    formik.touched.nombreTipoCasillero
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombreTipoCasillero}
                </Form.Control.Feedback>
              </Form.Group>

              {/* NO mostrar las fechas al modificar */}
              {/* Se eliminaron los campos de fecha */}

              <Modal.Footer className="mt-4">
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AbmTipoCasilleroModal;