import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { Percha } from "../../Types/Percha";
import type { EstadoCasilleroPercha } from "../../Types/EstadoCasilleroPercha";
import { useEffect, useState } from "react";
import { PerchaService } from "../../Services/PerchaService";
import { EstadoCasilleroPerchaService } from "../../Services/EstadoCasilleroPerchaService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";

type PerchaModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  percha: Percha;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AbmPerchaModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  percha,
  refreshData,
}: PerchaModalProps) => {
  const [estados, setEstados] = useState<EstadoCasilleroPercha[]>([]);
  const [perchas, setPerchas] = useState<Percha[]>([]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const cargarPerchas = await PerchaService.getPerchas();
        setPerchas(cargarPerchas);
        const datos = await EstadoCasilleroPerchaService.getEstados();
        setEstados(datos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEstados();
  }, []);

  const validationSchema = Yup.object().shape({
    numeroPercha: Yup.number().min(1).required("El número es obligatorio"),
    // Quitamos la validación requerida de fechaAltaPercha para que no sea obligatorio
    fechaAltaPercha: Yup.string(),
    estadoCasilleroPercha: Yup.object()
      .nullable()
      .required("El estado es requerido"),
  });

  const formik = useFormik({
    initialValues: percha,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: Percha) => handleSaveUpdate(values),
    enableReinitialize: true,
  });

  const handleDelete = async () => {
    try {
      const fechaBaja = new Date().toISOString().split("T")[0];

      const estadoBaja = estados.find(
        (e) => e.nombreEstadoCasilleroPercha === "Dado_de_baja"
      );

      if (!estadoBaja) {
        toast.error('No se encontró el estado "Dado_de_baja"');
        return;
      }

      await PerchaService.updatePercha(percha.id, {
        ...percha,
        fechaBajaPercha: fechaBaja,
        fechaModificacionPercha: fechaBaja,
        estadoCasilleroPercha: estadoBaja,
      });

      toast.success("Percha dada de baja");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de baja la percha");
    }
  };

  const handleRestore = async () => {
    try {
      const fechaMod = new Date().toISOString().split("T")[0];

      const estadoDisponible = estados.find(
        (e) => e.nombreEstadoCasilleroPercha === "Disponible"
      );

      if (!estadoDisponible) {
        toast.error('No se encontró el estado "Disponible"');
        return;
      }

      await PerchaService.updatePercha(percha.id, {
        ...percha,
        fechaBajaPercha: "",
        fechaModificacionPercha: fechaMod,
        estadoCasilleroPercha: estadoDisponible,
      });

      toast.success("Percha dada de alta");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de alta la percha");
    }
  };

  const handleSaveUpdate = async (values: Percha) => {
    try {
      const isNew = values.id === 0;

      if (isNew) {
        const chequearPercha = perchas.find(
          (p) => p.numeroPercha === values.numeroPercha
        );
        if (chequearPercha) {
          toast.error("Numero de percha ocupada");
          return;
        }

        // Asignar la fecha de alta automáticamente al crear
        values.fechaAltaPercha = new Date().toISOString().split("T")[0];
      } else {
        values.fechaModificacionPercha = new Date().toISOString().split("T")[0];
      }

      const action = isNew
        ? PerchaService.createPercha(values)
        : PerchaService.updatePercha(values.id, values);
      await action;

      toast.success(isNew ? "Percha creada" : "Percha actualizada");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <>
      {(modalType === ModalType.DELETE || modalType === ModalType.RESTORE) ? (
        <Modal show={showModal} centered backdrop="static">
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === ModalType.DELETE ? (
              <p>
                ¿Está seguro que desea dar de <strong>baja</strong> la percha con
                ID: <strong>{percha.id}</strong>?
              </p>
            ) : (
              <p>
                ¿Está seguro que desea <strong>dar de alta</strong> la percha con
                ID: <strong>{percha.id}</strong>?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            {modalType === ModalType.DELETE ? (
              <Button variant="danger" onClick={handleDelete}>
                Dar de Baja
              </Button>
            ) : (
              <Button variant="success" onClick={handleRestore}>
                Dar de Alta
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={showModal} centered backdrop="static">
          <Modal.Header closeButton onClick={onHide}>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mt-3">
                <FormLabel>Número de Percha</FormLabel>
                <Form.Control
                  name="numeroPercha"
                  type="number"
                  value={formik.values.numeroPercha}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!formik.errors.numeroPercha && formik.touched.numeroPercha
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.numeroPercha}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Fecha de Alta</FormLabel>
                <Form.Control
                  type="text"
                  readOnly
                  plaintext
                  value={
                    formik.values.fechaAltaPercha ||
                    new Date().toISOString().split("T")[0]
                  }
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Estado</FormLabel>
                <Form.Select
                  name="estadoCasilleroPercha"
                  value={formik.values.estadoCasilleroPercha?.id.toString() || ""}
                  onChange={(e) => {
                    const selected = estados.find(
                      (est) => est.id === parseInt(e.target.value)
                    );
                    formik.setFieldValue("estadoCasilleroPercha", selected || null);
                  }}
                  isInvalid={
                    !!formik.errors.estadoCasilleroPercha &&
                    formik.touched.estadoCasilleroPercha
                  }
                >
                  <option value="">Seleccione un estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nombreEstadoCasilleroPercha}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.estadoCasilleroPercha as string}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={onHide} className="me-2">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
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

export default AbmPerchaModal;