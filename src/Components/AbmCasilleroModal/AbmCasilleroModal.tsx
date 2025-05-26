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
import { Button, Form, Modal } from "react-bootstrap";

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
      } catch {
        toast.error('Error al cargar datos necesarios');
      }
    };
    fetchDatos();
  }, []);

  const validationSchema = Yup.object({
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
      await CasilleroService.darDeBaja(casillero.id);
      toast.success("Casillero dado de baja");
      onHide();
      refreshData(prev => !prev);
    } catch {
      toast.error("Error al dar de baja el casillero");
    }
  };

  const handleRestore = async () => {
    try {
      await CasilleroService.restaurarCasillero(casillero.id);
      toast.success("Casillero restaurado");
      onHide();
      refreshData(prev => !prev);
    } catch {
      toast.error("Error al dar de alta el casillero");
    }
  };

  const handleSaveUpdate = async (values: Casillero) => {
    try {
      const isNew = values.id === 0;
      if (isNew) {
        const existe = casilleros.some(c => c.numeroCasillero === values.numeroCasillero);
        if (existe) {
          toast.error("Ya existe un casillero con este número");
          return;
        }
        await CasilleroService.createCasillero(values);
        toast.success("Casillero creado", { position: "top-center" });
      } else {
        await CasilleroService.updateCasillero(casillero.id, values);
        toast.success("Casillero actualizado con éxito", { position: "top-center" });
      }
      onHide();
      refreshData(prev => !prev);
    } catch {
      toast.error("Error al guardar");
    }
  };

  // Render modal para eliminar/restaurar
  if (modalType === ModalType.DELETE || modalType === ModalType.RESTORE) {
    return (
      <Modal show={showModal} centered backdrop="static">
        <Modal.Header closeButton onClick={onHide}>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea {modalType === ModalType.DELETE ? <strong>dar de baja</strong> : <strong>dar de alta</strong>} el casillero con ID: <strong>{casillero.id}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          {modalType === ModalType.DELETE ? (
            <Button variant="danger" onClick={handleDelete}>Dar de Baja</Button>
          ) : (
            <Button variant="success" onClick={handleRestore}>Dar de Alta</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }

  // Render modal para crear/editar
  return (
    <Modal show={showModal} centered backdrop="static">
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title>{tituloModal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mt-3">
            <Form.Label>Número de Casillero</Form.Label>
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
            <Form.Label>Tipo de Casillero</Form.Label>
            <Form.Select
              name="tipoCasillero"
              value={formik.values.tipoCasillero?.id?.toString() || ''}
              onChange={e => {
                const selected = tipos.find(t => t.id === parseInt(e.target.value));
                formik.setFieldValue("tipoCasillero", selected || null);
              }}
              isInvalid={!!formik.errors.tipoCasillero && formik.touched.tipoCasillero}
            >
              <option value="">Seleccione un tipo</option>
              {tipos.map(tipo => (
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
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estadoCasilleroPercha"
              value={formik.values.estadoCasilleroPercha?.id?.toString() || ''}
              onChange={e => {
                const selected = estados.find(est => est.id === parseInt(e.target.value));
                formik.setFieldValue("estadoCasilleroPercha", selected || null);
              }}
              isInvalid={!!formik.errors.estadoCasilleroPercha && formik.touched.estadoCasilleroPercha}
            >
              <option value="">Seleccione un estado</option>
              {estados.map(estado => (
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
  );
};

export default AbmCasilleroModal;