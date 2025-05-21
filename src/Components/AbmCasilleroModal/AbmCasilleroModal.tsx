import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { Casillero } from "../../Types/Casillero";
import type { EstadoCasilleroPercha } from "../../Types/EstadoCasilleroPercha";
import type { TipoCasillero } from "../../Types/TipoCasillero";
import { useEffect, useState } from "react";
import { CasilleroService } from "../../Services/CasilleroService";
import { EstadoCasilleroPerchaService } from "../../Services/EstadoCasilleroPerchaService";
import { TipoCasilleroService } from "../../Services/TipoCasilleroService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";

type CasilleroModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  casillero: Casillero;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AbmCasilleroModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  casillero,
  refreshData,
}: CasilleroModalProps) => {
  const [estados, setEstados] = useState<EstadoCasilleroPercha[]>([]);
  const [tipos, setTipos] = useState<TipoCasillero[]>([]);
  const [casilleros, setCasilleros] = useState<Casillero[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [estadosData, tiposData, casillerosData] = await Promise.all([
          EstadoCasilleroPerchaService.getEstados(),
          TipoCasilleroService.getTiposCasillero(),
          CasilleroService.getCasilleros()
        ]);
        setEstados(estadosData);
        setTipos(tiposData);
        setCasilleros(casillerosData);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar datos necesarios');
      }
    };
    fetchDatos();
  }, []);

  const validationSchema = Yup.object().shape({
    numeroCasillero: Yup.number().min(1).required("El número es obligatorio"),
    tipoCasillero: Yup.object().required("El tipo es requerido"),
    estadoCasilleroPercha: Yup.object().required("El estado es requerido"),
  });

  const formik = useFormik({
    initialValues: casillero,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: Casillero) => handleSaveUpdate(values),
    enableReinitialize: true,
  });

  const handleDelete = async () => {
    try {
      const fechaBaja = new Date().toISOString().split("T")[0];
      const estadoBaja = estados.find(e => e.nombreEstadoCasilleroPercha === "Dado_de_baja");

      if (!estadoBaja) {
        toast.error('No se encontró el estado "Dado_de_baja"');
        return;
      }

      await CasilleroService.updateCasillero(casillero.id, {
        ...casillero,
        fechaBajaCasillero: fechaBaja,
        fechaModificacionCasillero: fechaBaja,
        estadoCasilleroPercha: estadoBaja,
      });

      toast.success("Casillero dado de baja");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de baja el casillero");
    }
  };

  const handleRestore = async () => {
    try {
      const fechaMod = new Date().toISOString().split("T")[0];
      const estadoDisponible = estados.find(e => e.nombreEstadoCasilleroPercha === "Disponible");

      if (!estadoDisponible) {
        toast.error('No se encontró el estado "Disponible"');
        return;
      }

      await CasilleroService.updateCasillero(casillero.id, {
        ...casillero,
        fechaBajaCasillero: null,
        fechaModificacionCasillero: fechaMod,
        estadoCasilleroPercha: estadoDisponible,
      });

      toast.success("Casillero dado de alta");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de alta el casillero");
    }
  };

  const handleSaveUpdate = async (values: Casillero) => {
    try {
      const isNew = values.id === 0;

      if (isNew) {
        const casilleroExistente = casilleros.find(c => 
          c.numeroCasillero === values.numeroCasillero
        );
        if (casilleroExistente) {
          toast.error("Ya existe un casillero con este número");
          return;
        }
      }

      if (!isNew) {
        values.fechaModificacionCasillero = new Date().toISOString().split("T")[0];
      } else {
        values.fechaAltaCasillero = new Date().toISOString().split("T")[0];
      }

      const action = isNew
        ? CasilleroService.createCasillero(values)
        : CasilleroService.updateCasillero(values.id, values);
      await action;

      toast.success(isNew ? "Casillero creado" : "Casillero actualizado");
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
                ¿Está seguro que desea dar de <strong>baja</strong> el casillero con ID:{" "}
                <strong>{casillero.id}</strong>?
              </p>
            ) : (
              <p>
                ¿Está seguro que desea <strong>dar de alta</strong> el casillero con ID:{" "}
                <strong>{casillero.id}</strong>?
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
                <FormLabel>Número de Casillero</FormLabel>
                <Form.Control
                  name="numeroCasillero"
                  type="number"
                  value={formik.values.numeroCasillero}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.numeroCasillero && formik.touched.numeroCasillero}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.numeroCasillero}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Tipo de Casillero</FormLabel>
                <Form.Select
                  name="tipoCasillero"
                  value={formik.values.tipoCasillero?.id.toString() || ''}
                  onChange={(e) => {
                    const selected = tipos.find(t => t.id === parseInt(e.target.value));
                    formik.setFieldValue("tipoCasillero", selected || null);
                  }}
                  isInvalid={!!formik.errors.tipoCasillero && formik.touched.tipoCasillero}
                >
                  <option value="">Seleccione un tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombreTipoCasillero}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.tipoCasillero as string}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <FormLabel>Estado</FormLabel>
                <Form.Select
                  name="estadoCasilleroPercha"
                  value={formik.values.estadoCasilleroPercha?.id.toString() || ''}
                  onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const selected = estados.find(e => e.id === parseInt(value));
                    formik.setFieldValue("estadoCasilleroPercha", selected || null);
                  } else {
                    formik.setFieldValue("estadoCasilleroPercha", null);
                  }
                }}

                  isInvalid={!!formik.errors.estadoCasilleroPercha && formik.touched.estadoCasilleroPercha}
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
                  {modalType === ModalType.CREATE ? 'Crear' : 'Actualizar'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AbmCasilleroModal;