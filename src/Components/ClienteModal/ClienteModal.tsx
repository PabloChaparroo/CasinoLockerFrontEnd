import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { Cliente } from "../../Types/Cliente";
import { useEffect, useState } from "react";
import { ClienteService } from "../../Services/ClienteService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";

type ClienteModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  cliente: Cliente;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClienteModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  cliente,
  refreshData,
}: ClienteModalProps) => {
  // Opcional: si decides mantener esta lista para validaciones
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const datos = await ClienteService.getClientes();
        setClientes(datos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClientes();
  }, []);

  const validationSchema = Yup.object().shape({
    nombreCliente: Yup.string().required("El nombre es obligatorio"),
    dniCliente: Yup.number()
      .min(1, "DNI inválido")
      .required("El DNI es obligatorio"),
    telefonoCliente: Yup.number().required("El teléfono es obligatorio"),
    mailCliente: Yup.string().email("Email inválido").required("Email es obligatorio"),
  });

  const formik = useFormik({
    initialValues: cliente,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: Cliente) => handleSaveUpdate(values),
    enableReinitialize: true,
  });

  const handleDelete = async () => {
    try {
      // Usar el endpoint PUT darDeBaja/{id}
      await ClienteService.deleteCliente(cliente.id);

      toast.success("Cliente dado de baja");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de baja el cliente");
    }
  };

  const handleRestore = async () => {
    try {
      await ClienteService.restaurarCliente(cliente.id);

      toast.success("Cliente dado de alta");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de alta el cliente");
    }
  };

  const handleSaveUpdate = async (values: Cliente) => {
    try {
      const isNew = values.id === 0;

      // Validar dni único para nuevo cliente
      if (isNew) {
        const dniRepetido = clientes.find((c) => c.dniCliente === values.dniCliente);
        if (dniRepetido) {
          toast.error("El DNI ya está registrado");
          return;
        }
      }

      if (!isNew) {
        values.fechaHoraModificacionCliente = new Date().toISOString().split("T")[0];
      } else {
        values.fechaHoraAltaCliente = new Date().toISOString().split("T")[0];
      }

      const action = isNew
        ? ClienteService.createCliente(values)
        : ClienteService.updateCliente(values.id, values);
      await action;

      toast.success(isNew ? "Cliente creado" : "Cliente actualizado");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al guardar el cliente");
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
                ¿Está seguro que desea dar de <strong>baja</strong> el cliente con ID:{" "}
                <strong>{cliente.id}</strong>?
              </p>
            ) : (
              <p>
                ¿Está seguro que desea <strong>dar de alta</strong> el cliente con ID:{" "}
                <strong>{cliente.id}</strong>?
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
                <FormLabel>Nombre</FormLabel>
                <Form.Control
                  name="nombreCliente"
                  type="text"
                  value={formik.values.nombreCliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.nombreCliente && formik.touched.nombreCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombreCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>DNI</FormLabel>
                <Form.Control
                  name="dniCliente"
                  type="number"
                  value={formik.values.dniCliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.dniCliente && formik.touched.dniCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.dniCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Teléfono</FormLabel>
                <Form.Control
                  name="telefonoCliente"
                  type="number"
                  value={formik.values.telefonoCliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.telefonoCliente && formik.touched.telefonoCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.telefonoCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Email</FormLabel>
                <Form.Control
                  name="mailCliente"
                  type="email"
                  value={formik.values.mailCliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.mailCliente && formik.touched.mailCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.mailCliente}
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

export default ClienteModal;