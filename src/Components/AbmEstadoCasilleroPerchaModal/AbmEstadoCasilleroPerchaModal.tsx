import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { EstadoCasilleroPercha } from "../../Types/EstadoCasilleroPercha";
import { useEffect, useState } from "react";
import { EstadoCasilleroPerchaService } from "../../Services/EstadoCasilleroPerchaService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";

type EstadoCasilleroPerchaModalProps = {
    tituloModal: string;
    showModal: boolean;
    onHide: () => void;
    modalType: ModalType;
    estadoCasilleroPercha: EstadoCasilleroPercha;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>; 
}

const AbmEstadoCasilleroPerchaModal = ({tituloModal, showModal, onHide, modalType, estadoCasilleroPercha, refreshData}: EstadoCasilleroPerchaModalProps) => {
 
    const [estadosCasilleroPercha, setEstadoCasilleroPercha] = useState<EstadoCasilleroPercha[]>([]);
    
    // Función para obtener fecha actual en formato YYYY-MM-DD
    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const datosEstadoCasilleroPercha = await EstadoCasilleroPerchaService.getEstados();
                setEstadoCasilleroPercha(datosEstadoCasilleroPercha);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar estados");
            }
        };
        fetchDatos();
    }, []);

    // Esquema de validación
    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            nombreEstadoCasilleroPercha: Yup.string().required('El nombre es requerido'),
            colorEstadoCasilleroPercha: Yup.string().required('El color es requerido'),
            fechaAltaEstadoCasilleroPercha: Yup.string().required('La fecha de alta es requerida'),
            fechaModificacionEstadoCasilleroPercha: Yup.string().nullable()
        });
    };

    // Inicialización de valores con fechas automáticas
    const initialValues = {
      ...estadoCasilleroPercha,
      fechaAltaEstadoCasilleroPercha: estadoCasilleroPercha.fechaAltaEstadoCasilleroPercha || getCurrentDate(),
      fechaModificacionEstadoCasilleroPercha: modalType === ModalType.UPDATE 
        ? getCurrentDate() 
        : estadoCasilleroPercha.fechaModificacionEstadoCasilleroPercha || ""
    };

     const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(),
    onSubmit: (estado: EstadoCasilleroPercha) => handleSaveUpdate(estado)
    });

    const handleDelete = async () => {
        try {
            await EstadoCasilleroPerchaService.deleteEstado(estadoCasilleroPercha.id);
            toast.success("Estado borrado", { position: "top-center" });
            onHide();
            refreshData(prev => !prev);
        } catch (error) {
            console.error(error);
            toast.error("Error al borrar estado");
        }
    };

    const handleSaveUpdate = async (formData: EstadoCasilleroPercha) => {
        try {
            const datosParaGuardar = {
                ...formData,
                // Preservar fecha original en updates
                fechaAltaEstadoCasilleroPercha: modalType === ModalType.UPDATE 
                    ? estadoCasilleroPercha.fechaAltaEstadoCasilleroPercha 
                    : getCurrentDate(),
                // Actualizar fecha modificación solo en updates
                fechaModificacionEstadoCasilleroPercha: modalType === ModalType.UPDATE 
                    ? getCurrentDate() 
                    : null
            };

            if (modalType === ModalType.CREATE) {
                await EstadoCasilleroPerchaService.createEstado(datosParaGuardar);
            } else {
                await EstadoCasilleroPerchaService.updateEstado(formData.id, datosParaGuardar);
            }

            toast.success(modalType === ModalType.CREATE 
                ? "Estado creado con éxito" 
                : "Estado actualizado con éxito", 
                { position: "top-center" });
            
            onHide();
            refreshData(prev => !prev);
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
                        <p>¿Está seguro que desea eliminar el estado?<br /> 
                        <strong>{estadoCasilleroPercha.id}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                        <Button variant="danger" onClick={handleDelete}>Borrar</Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <Modal show={showModal} centered backdrop="static">
                    <Modal.Header closeButton onClick={onHide}>
                        <Modal.Title>{tituloModal}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>
                            {/* Campo Nombre */}
                            <Form.Group controlId="formNombreEstadoCasilleroPercha" className="mt-3">
                                <Form.Label>Nombre del estado:</Form.Label>
                                <Form.Control
                                    name="nombreEstadoCasilleroPercha"
                                    type="text"
                                    value={formik.values.nombreEstadoCasilleroPercha || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.nombreEstadoCasilleroPercha && formik.touched.nombreEstadoCasilleroPercha}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.nombreEstadoCasilleroPercha}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Color */}
                            <Form.Group controlId="formColorEstadoCasilleroPercha" className="mt-3">
                                <Form.Label>Color del estado:</Form.Label>
                                <Form.Control
                                    name="colorEstadoCasilleroPercha"
                                    type="color"
                                    value={formik.values.colorEstadoCasilleroPercha || "#000000"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.colorEstadoCasilleroPercha && formik.touched.colorEstadoCasilleroPercha}
                                    style={{ height: '40px', padding: '2px' }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.colorEstadoCasilleroPercha}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Fecha Alta (solo lectura en updates) */}
                            <Form.Group controlId="formFechaAltaEstadoCasilleroPercha" className="mt-3">
                                <FormLabel>Fecha Alta:</FormLabel>
                                <Form.Control
                                    name="fechaAltaEstadoCasilleroPercha"
                                    type="date"
                                    value={formik.values.fechaAltaEstadoCasilleroPercha || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        
                                    }}
                                    disabled // Siempre deshabilitado
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.fechaAltaEstadoCasilleroPercha && formik.touched.fechaAltaEstadoCasilleroPercha}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.fechaAltaEstadoCasilleroPercha}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Fecha Modificación (solo visible en updates) */}
                            {modalType === ModalType.UPDATE && (
                                <Form.Group controlId="formFechaModificacionEstadoCasilleroPercha" className="mt-3">
                              <FormLabel>Fecha Modificación:</FormLabel>
                              <Form.Control
                                name="fechaModificacionEstadoCasilleroPercha"
                                type="date"
                                value={formik.values.fechaModificacionEstadoCasilleroPercha || ""}
                                onChange={formik.handleChange}
                                disabled
                                onBlur={formik.handleBlur}
                              />
                            </Form.Group>
                            )}

                            <Modal.Footer className="mt-4">
                                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
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

export default AbmEstadoCasilleroPerchaModal;