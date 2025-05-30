import React, { useEffect, useState } from 'react'
import type { ModalType } from '../../enums/ModalTypes';
import type { Reserva } from '../../Types/Reserva';
import * as Yup from "yup";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { ClienteService } from '../../Services/ClienteService';
import type { Cliente } from '../../Types/Cliente';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ReservaService } from '../../Services/ReservaService';
import { ObjetoService } from '../../Services/ObjetoServices';
import { EstadoCasilleroPerchaService } from '../../Services/EstadoCasilleroPerchaService';
import { CasilleroService } from '../../Services/CasilleroService';

type ReservaModalProps = {
    tituloModal: string;
    showModal: boolean;
    onHide: () => void;
    modalType: ModalType;
    reserva: Reserva;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReservaModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  reserva,
  refreshData
}: ReservaModalProps) => {

 // Validation schema
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

// Initial values
const initialValues: Reserva = {
  id: 0,
  numeroReserva: 0,
  fechaAltaReserva: null,
  fechaModificacionReserva: null,
  fechaBajaReserva: null,
  estadoReserva: null,
  objetos: null,
  casillero: null,
  usuario: null,
  cliente: null,
};

// useFormik
const formik = useFormik({
  initialValues,
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
      setClientesFiltrados(todos); // muestra todos al principio
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
        console.log("Usuario:", JSON.stringify(usuarioLogueado, null, 2));

        values.usuario = usuarioLogueado;
        const objetosCreados = await Promise.all(
        (values.objetos || []).map(obj =>
          ObjetoService.createObjeto(obj)
        )
      );
      //console.log("Objetos creados:", JSON.stringify(objetosCreados, null, 2));
      values.objetos = objetosCreados;
        values.casillero = reserva.casillero; // Asignar el casillero actual
        
        console.log("Valores de reserva:", JSON.stringify(values, null, 2));
        await ReservaService.createReserva(values);
        toast.success("Reserva creada", { position: "top-center" });
      } 
      onHide();
      refreshData(prev => !prev);
    } catch {
      toast.error("Error al guardar");
    }
  };




  return (
    <Modal show={showModal} onHide={onHide}  centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{tituloModal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormikProvider value={formik}>
          <Form noValidate onSubmit={formik.handleSubmit}>
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
      {cliente.nombreCliente} - {cliente.dniCliente} {/* Puedes mostrar más info si hay nombres repetidos */}
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
      formik.setFieldValue("cliente", null); // limpia selección anterior
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
            <FieldArray
              name="objetos"
              render={arrayHelpers => (
                <div>
                  {formik.values.objetos && formik.values.objetos.length > 0 && formik.values.objetos.map((objeto, idx) => (
                    <div key={idx} className="mb-3 border rounded p-2">
                      <Row>
                        <Col>
                          <Form.Group controlId={`objetos.${idx}.numeroObjeto`}>
                            <Form.Label>Número Objeto</Form.Label>
                            <Form.Control
                              type="number"
                              name={`objetos.${idx}.numeroObjeto`}
                              value={objeto.numeroObjeto}
                              onChange={formik.handleChange}
                              isInvalid={
                                !!formik.errors.objetos &&
                                !!(formik.errors.objetos as any)[idx]?.numeroObjeto &&
                                !!(Array.isArray(formik.touched.objetos) && formik.touched.objetos[idx]?.numeroObjeto)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {(formik.errors.objetos as any)?.[idx]?.numeroObjeto}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId={`objetos.${idx}.descripcionObjeto`}>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                              type="text"
                              name={`objetos.${idx}.descripcionObjeto`}
                              value={objeto.descripcionObjeto}
                              onChange={formik.handleChange}
                              isInvalid={
                                !!formik.errors.objetos &&
                                !!(formik.errors.objetos as any)[idx]?.descripcionObjeto &&
                                !!(Array.isArray(formik.touched.objetos) && formik.touched.objetos[idx]?.descripcionObjeto)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {(formik.errors.objetos as any)?.[idx]?.descripcionObjeto}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col xs="auto" className="d-flex align-items-end">
                          {formik.values.objetos && formik.values.objetos.length > 1 && (
                            <Button
                              variant="danger"
                              onClick={() => arrayHelpers.remove(idx)}
                              size="sm"
                            >
                              Quitar
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() =>
                      arrayHelpers.push({
                        id: 0,
                        numeroObjeto: 0,
                        descripcionObjeto: "",
                        fechaAltaObjeto: null,
                        fechaModificacionObjeto: null,
                        fechaBajaObjeto: null,
                      })
                    }
                  >
                    Agregar Objeto
                  </Button>
                </div>
              )}
            />

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
  )
};

export default ReservaModal