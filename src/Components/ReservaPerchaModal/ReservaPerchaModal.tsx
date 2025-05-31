import React, { useEffect, useState } from 'react';
import type { ModalType } from '../../enums/ModalTypes';
import type { Reserva } from '../../Types/Reserva';
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { ClienteService } from '../../Services/ClienteService';
import type { Cliente } from '../../Types/Cliente';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ReservaService } from '../../Services/ReservaService';
import { ObjetoService } from '../../Services/ObjetoServices';

const ReservaPerchaModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  reserva,
  refreshData
}: {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  reserva: Reserva;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const validationSchema = Yup.object().shape({
    cliente: Yup.object().required("Seleccione un cliente"),
    objetos: Yup.array()
      .of(
        Yup.object().shape({
          numeroObjeto: Yup.number()
            .typeError("Debe ser un número")
            .required("Ingrese el número de objeto"),
          descripcionObjeto: Yup.string().required("Ingrese la descripción"),
        })
      )
      .min(1, "Debe agregar al menos un objeto"),
  });

  const formik = useFormik({
    initialValues: reserva,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [searchNombre, setSearchNombre] = useState("");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const todos = await ClienteService.getClientes();
        setClientes(todos);
        setClientesFiltrados(todos);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error al cargar los clientes");
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, [refreshData]);

const handleSave = async (values: Reserva) => {
  try {
    const isNew = values.id === 0;
    if (isNew) {
      const usuarioLogueado = JSON.parse(localStorage.getItem("usuario")!);
      
      // Crear primero el objeto
      const objetoCreado = await ObjetoService.createObjeto(values.objetos![0]);
      
      // Preparar el payload para la reserva
      const reservaPayload = {
        cliente: { id: values.cliente?.id },
        usuario: { id: usuarioLogueado.id },
        percha: { id: values.percha?.id },
        objetos: [{ id: objetoCreado.id }], // Solo enviamos el ID del objeto creado
        estadoReserva: "Reservado"
      };

      console.log("Payload de reserva a enviar:", JSON.stringify(reservaPayload, null, 2));
      
      await ReservaService.createReserva(reservaPayload);
      toast.success("Reserva creada", { position: "top-center" });
    }

    onHide();
    refreshData(prev => !prev);
  } catch (error) {
    console.error("Error al guardar reserva:", error);
    toast.error("Error al guardar");
  }
};

  return (
    <Modal show={showModal} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{tituloModal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>

            {/* Mostrar percha */}
            {formik.values.percha && (
              <div className="mb-3">
                <strong>Percha seleccionada:</strong> #{formik.values.percha.numeroPercha}
              </div>
            )}

            {/* Cliente */}
            <Form.Group className="mb-3" controlId="cliente">
              <Form.Label>Cliente</Form.Label>
              <Row className="align-items-center">
                <Col xs={5}>
                  <Form.Select
                    name="cliente"
                    value={formik.values.cliente?.id || ""}
                    onChange={e => {
                      const selected = clientesFiltrados.find(c => c.id === Number(e.target.value));
                      formik.setFieldValue("cliente", selected || null);
                    }}
                    isInvalid={!!formik.errors.cliente && formik.touched.cliente}
                    className="form-select-sm"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientesFiltrados.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombreCliente} - {cliente.dniCliente}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.cliente as string}
                  </Form.Control.Feedback>
                </Col>
                <Col xs={6}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Buscar por nombre"
                      value={searchNombre}
                      onChange={e => setSearchNombre(e.target.value)}
                      className="me-2 form-control-sm"
                      style={{ minWidth: "140px" }}
                    />
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const encontrados = await ClienteService.buscarClientesPorNombre(searchNombre);
                          setClientesFiltrados(encontrados);
                          formik.setFieldValue("cliente", null);
                        } catch {
                          toast.error("Error al buscar clientes");
                        }
                        setIsLoading(false);
                      }}
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form.Group>

            {/* Objetos */}
            {formik.values.objetos?.map((objeto, index) => (
              <div key={index} className="mb-3 border rounded p-2">
                <Row>
                  <Col>
                    <Form.Group controlId={`objetos.${index}.numeroObjeto`}>
                      <Form.Label>Número Objeto</Form.Label>
                      <Form.Control
                        type="number"
                        name={`objetos.${index}.numeroObjeto`}
                        value={objeto.numeroObjeto || ""}
                        onChange={formik.handleChange}
                        isInvalid={
                          !!formik.errors.objetos &&
                          !!(formik.errors.objetos as any)[index]?.numeroObjeto &&
                          !!(formik.touched.objetos?.[index]?.numeroObjeto)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {(formik.errors.objetos as any)?.[index]?.numeroObjeto}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`objetos.${index}.descripcionObjeto`}>
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        type="text"
                        name={`objetos.${index}.descripcionObjeto`}
                        value={objeto.descripcionObjeto || ""}
                        onChange={formik.handleChange}
                        isInvalid={
                          !!formik.errors.objetos &&
                          !!(formik.errors.objetos as any)[index]?.descripcionObjeto &&
                          !!(formik.touched.objetos?.[index]?.descripcionObjeto)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {(formik.errors.objetos as any)?.[index]?.descripcionObjeto}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Crear Reserva
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </Modal.Body>
    </Modal>
  );
};

export default ReservaPerchaModal;