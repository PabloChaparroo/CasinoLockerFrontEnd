import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { EstadoCasilleroPercha } from "../../Types/EstadoCasilleroPercha";
import { useEffect } from "react";
import { EstadoCasilleroPerchaService } from "../../Services/EstadoCasilleroPerchaService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, Modal } from "react-bootstrap";

type EstadoCasilleroPerchaModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  estadoCasilleroPercha: EstadoCasilleroPercha;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AbmEstadoCasilleroPerchaModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  estadoCasilleroPercha,
  refreshData
}: EstadoCasilleroPerchaModalProps) => {

  const validationSchema = Yup.object().shape({
    nombreEstadoCasilleroPercha: Yup.string().required("El nombre es requerido"),
    colorEstadoCasilleroPercha: Yup.string().required("El color es requerido"),
    reservable: Yup.boolean().required("Debe indicar si es reservable")
  });

  const initialValues = {
    nombreEstadoCasilleroPercha: estadoCasilleroPercha.nombreEstadoCasilleroPercha || "",
    colorEstadoCasilleroPercha: estadoCasilleroPercha.colorEstadoCasilleroPercha || "#000000",
    reservable: estadoCasilleroPercha.reservable || false,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (formData) => handleSaveUpdate(formData)
  });

  const handleDelete = async () => {
    try {
      await EstadoCasilleroPerchaService.darDeBaja(estadoCasilleroPercha.id);
      toast.success("Estado dado de baja", { position: "top-center" });
      onHide();
      refreshData(prev => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al dar de baja el estado");
    }
  };

  const handleRestore = async () => {
    try {
      await EstadoCasilleroPerchaService.restaurar(estadoCasilleroPercha.id);
      toast.success("Estado restaurado", { position: "top-center" });
      onHide();
      refreshData(prev => !prev);
    } catch (error) {
      console.error(error);
      toast.error("Error al restaurar el estado");
    }
  };

const handleSaveUpdate = async (formData: typeof initialValues) => {
  try {
    if (modalType === ModalType.CREATE) {
        const nuevoEstado = {
          ...formData
      };
      await EstadoCasilleroPerchaService.createEstado(nuevoEstado);
      toast.success("Estado creado con éxito", { position: "top-center" });
    } else if (modalType === ModalType.UPDATE) {
      // Solo los campos editables + id, no tocar fechas
      const updatedEstado = {
        id: estadoCasilleroPercha.id,
        nombreEstadoCasilleroPercha: formData.nombreEstadoCasilleroPercha,
        colorEstadoCasilleroPercha: formData.colorEstadoCasilleroPercha,
        reservable: formData.reservable,
        // No enviamos fechaAlta ni fechaModificacion
      };
      await EstadoCasilleroPerchaService.updateEstado(estadoCasilleroPercha.id!, updatedEstado);
      toast.success("Estado actualizado con éxito", { position: "top-center" });
    }
    onHide();
    refreshData(prev => !prev);
  } catch (error) {
    console.error("Error:", error);
    toast.error("Ha ocurrido un error");
  }
};

  useEffect(() => {
    if (modalType === ModalType.UPDATE || modalType === ModalType.CREATE) {
      formik.resetForm();
    }
  }, [modalType, estadoCasilleroPercha]);

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={showModal} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {estadoCasilleroPercha.fechaBajaEstadoCasilleroPercha
                ? "Confirmar Restauración"
                : "Confirmar Baja"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {estadoCasilleroPercha.fechaBajaEstadoCasilleroPercha
                ? `¿Está seguro que desea restaurar el estado "${estadoCasilleroPercha.nombreEstadoCasilleroPercha}"?`
                : `¿Está seguro que desea dar de baja el estado "${estadoCasilleroPercha.nombreEstadoCasilleroPercha}"?`}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button
              variant={estadoCasilleroPercha.fechaBajaEstadoCasilleroPercha ? "success" : "danger"}
              onClick={
                estadoCasilleroPercha.fechaBajaEstadoCasilleroPercha ? handleRestore : handleDelete
              }
            >
              {estadoCasilleroPercha.fechaBajaEstadoCasilleroPercha
                ? "Confirmar Restauración"
                : "Confirmar Baja"}
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={showModal} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="nombreEstadoCasilleroPercha">
                <Form.Label>Nombre Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreEstadoCasilleroPercha"
                  value={formik.values.nombreEstadoCasilleroPercha}
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.nombreEstadoCasilleroPercha && formik.touched.nombreEstadoCasilleroPercha}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombreEstadoCasilleroPercha}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="colorEstadoCasilleroPercha">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="color"
                  name="colorEstadoCasilleroPercha"
                  value={formik.values.colorEstadoCasilleroPercha}
                  onChange={formik.handleChange}
                  title={formik.values.colorEstadoCasilleroPercha}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.colorEstadoCasilleroPercha}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="reservable">
                <Form.Check
                  type="checkbox"
                  label="Reservable"
                  name="reservable"
                  checked={formik.values.reservable}
                  onChange={formik.handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={onHide} className="me-2">
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {modalType === ModalType.CREATE ? "Crear" : "Actualizar"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AbmEstadoCasilleroPerchaModal;