import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import type { Cliente } from '../../Types/Cliente';
import { useEffect, useState } from 'react';
import { ClienteService } from '../../Services/ClienteService';
import { ModalType } from '../../enums/ModalTypes';
import { Button, Form, FormLabel, Modal } from 'react-bootstrap';

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
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const datosClientes = await ClienteService.getClientes();
        setClientes(datosClientes);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar clientes');
      }
    };
    fetchDatos();
  }, []);

  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      nombreCliente: Yup.string().required('El nombre es requerido'),
      dniCliente: Yup.number().required('El DNI es requerido').positive().integer(),
      telefonoCliente: Yup.number().required('El teléfono es requerido').positive().integer(),
      mailCliente: Yup.string().email('Email inválido').required('El email es requerido'),
      fechaAltaCliente: Yup.string().required('La fecha de alta es requerida'),
      fechaModificacionCliente: Yup.string().nullable(),
    });
  };

  const initialValues = {
    ...cliente,
    fechaAltaCliente: cliente.fechaAltaCliente || getCurrentDate(),
    fechaModificacionCliente: modalType === ModalType.UPDATE ? getCurrentDate() : cliente.fechaModificacionCliente || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(),
    onSubmit: (cliente: Cliente) => handleSaveUpdate(cliente),
  });

  const handleDelete = async () => {
    try {
      await ClienteService.deleteCliente(cliente.id);
      toast.success('Cliente borrado', { position: 'top-center' });
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error(error);
      toast.error('Error al borrar cliente');
    }
  };

  const handleSaveUpdate = async (formData: Cliente) => {
    try {
      const datosParaGuardar = {
        ...formData,
        fechaAltaCliente: modalType === ModalType.UPDATE ? cliente.fechaAltaCliente : getCurrentDate(),
        fechaModificacionCliente: modalType === ModalType.UPDATE ? getCurrentDate() : null,
      };

      if (modalType === ModalType.CREATE) {
        await ClienteService.createCliente(datosParaGuardar);
      } else {
        await ClienteService.updateCliente(formData.id, datosParaGuardar);
      }

      toast.success(
        modalType === ModalType.CREATE ? 'Cliente creado con éxito' : 'Cliente actualizado con éxito',
        { position: 'top-center' }
      );

      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ha ocurrido un error');
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
              ¿Está seguro que desea eliminar el cliente?<br />
              <strong>{cliente.nombreCliente}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Borrar
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
              <Form.Group controlId="formNombreCliente" className="mt-3">
                <Form.Label>Nombre del cliente:</Form.Label>
                <Form.Control
                  name="nombreCliente"
                  type="text"
                  value={formik.values.nombreCliente || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.nombreCliente && formik.touched.nombreCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombreCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDniCliente" className="mt-3">
                <Form.Label>DNI del cliente:</Form.Label>
                <Form.Control
                  name="dniCliente"
                  type="number"
                  value={formik.values.dniCliente || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.dniCliente && formik.touched.dniCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.dniCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formTelefonoCliente" className="mt-3">
                <Form.Label>Teléfono del cliente:</Form.Label>
                <Form.Control
                  name="telefonoCliente"
                  type="number"
                  value={formik.values.telefonoCliente || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.telefonoCliente && formik.touched.telefonoCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.telefonoCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formMailCliente" className="mt-3">
                <Form.Label>Email del cliente:</Form.Label>
                <Form.Control
                  name="mailCliente"
                  type="email"
                  value={formik.values.mailCliente || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.mailCliente && formik.touched.mailCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.mailCliente}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formFechaAltaCliente" className="mt-3">
                <FormLabel>Fecha Alta:</FormLabel>
                <Form.Control
                  name="fechaAltaCliente"
                  type="date"
                  value={formik.values.fechaAltaCliente || getCurrentDate()}
                  onChange={(e) => {}}
                  disabled
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.fechaAltaCliente && formik.touched.fechaAltaCliente}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fechaAltaCliente}
                </Form.Control.Feedback>
              </Form.Group>

              {modalType === ModalType.UPDATE && (
                <Form.Group controlId="formFechaModificacionCliente" className="mt-3">
                  <FormLabel>Fecha Modificación:</FormLabel>
                  <Form.Control
                    name="fechaModificacionCliente"
                    type="date"
                    value={formik.values.fechaModificacionCliente || ''}
                    onChange={formik.handleChange}
                    disabled
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              )}

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

export default ClienteModal;
