import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { TipoCasilleroService } from "../../Services/TipoCasilleroService";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import type { TipoCasillero } from "../../Types/TipoCasillero";

type TipoCasilleroModalProps = {
    tituloModal: string;
    showModal: boolean;
    onHide: () => void;
    modalType: ModalType;
    tipoCasillero: TipoCasillero;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>; 
}

const AbmTipoCasilleroModal = ({
    tituloModal, 
    showModal, 
    onHide, 
    modalType, 
    tipoCasillero, 
    refreshData
}: TipoCasilleroModalProps) => {
 
    const [tiposCasillero, setTiposCasillero] = useState<TipoCasillero[]>([]);
    
    // Función para obtener fecha actual en formato YYYY-MM-DD
    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const datosTiposCasillero = await TipoCasilleroService.getTiposCasillero();
                setTiposCasillero(datosTiposCasillero);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar tipos de casillero");
            }
        };
        fetchDatos();
    }, []);

    // Esquema de validación
    const validationSchema = () => {
        return Yup.object().shape({
            idTipoCasillero: Yup.number().integer().min(0),
            nombreTipoCasillero: Yup.string().required('El nombre es requerido'),
            fechaAltaTipoCasillero: Yup.string().required('La fecha de alta es requerida'),
            fechaModificacionTipoCasillero: Yup.string().nullable()
        });
    };

    // Inicialización de valores con fechas automáticas
    const initialValues = {
        ...tipoCasillero,
        fechaAltaTipoCasillero: tipoCasillero.fechaAltaTipoCasillero || getCurrentDate(),
        fechaModificacionTipoCasillero: modalType === ModalType.UPDATE 
            ? getCurrentDate() 
            : tipoCasillero.fechaModificacionTipoCasillero || ""
    };

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema(),
        onSubmit: (tipo: TipoCasillero) => handleSaveUpdate(tipo)
    });

    const handleDelete = async () => {
        try {
            await TipoCasilleroService.deleteTipoCasillero(tipoCasillero.id);
            toast.success("Tipo de casillero borrado", { position: "top-center" });
            onHide();
            refreshData(prev => !prev);
        } catch (error) {
            console.error(error);
            toast.error("Error al borrar tipo de casillero");
        }
    };

    const handleSaveUpdate = async (formData: TipoCasillero) => {
        try {
            const datosParaGuardar = {
                ...formData,
                // Preservar fecha original en updates
                fechaAltaTipoCasillero: modalType === ModalType.UPDATE 
                    ? tipoCasillero.fechaAltaTipoCasillero 
                    : getCurrentDate(),
                // Actualizar fecha modificación solo en updates
                fechaModificacionTipoCasillero: modalType === ModalType.UPDATE 
                    ? getCurrentDate() 
                    : null
            };

            if (modalType === ModalType.CREATE) {
                await TipoCasilleroService.createTipoCasillero(datosParaGuardar);
            } else {
                await TipoCasilleroService.updateTipoCasillero(formData.id, datosParaGuardar);
            }

            toast.success(modalType === ModalType.CREATE 
                ? "Tipo de casillero creado con éxito" 
                : "Tipo de casillero actualizado con éxito", 
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
                        <p>¿Está seguro que desea eliminar el tipo de casillero?<br /> 
                        <strong>{tipoCasillero.nombreTipoCasillero}</strong>?</p>
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
                            <Form.Group controlId="formNombreTipoCasillero" className="mt-3">
                                <Form.Label>Nombre del tipo de casillero:</Form.Label>
                                <Form.Control
                                    name="nombreTipoCasillero"
                                    type="text"
                                    value={formik.values.nombreTipoCasillero || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.nombreTipoCasillero && formik.touched.nombreTipoCasillero}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.nombreTipoCasillero}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Fecha Alta (solo lectura en updates) */}
                            <Form.Group controlId="formFechaAltaTipoCasillero" className="mt-3">
                                <FormLabel>Fecha Alta:</FormLabel>
                                <Form.Control
                                    name="fechaAltaTipoCasillero"
                                    type="date"
                                    value={formik.values.fechaAltaTipoCasillero || getCurrentDate()}
                                    onChange={(e) => {
                             
                                    }}
                                    disabled // Siempre deshabilitado
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.fechaAltaTipoCasillero && formik.touched.fechaAltaTipoCasillero}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.fechaAltaTipoCasillero}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Fecha Modificación (solo visible en updates) */}
                            {modalType === ModalType.UPDATE && (
                                <Form.Group controlId="formFechaModificacionTipoCasillero" className="mt-3">
                                    <FormLabel>Fecha Modificación:</FormLabel>
                                    <Form.Control
                                        name="fechaModificacionTipoCasillero"
                                        type="date"
                                        value={formik.values.fechaModificacionTipoCasillero || ""}
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

export default AbmTipoCasilleroModal;