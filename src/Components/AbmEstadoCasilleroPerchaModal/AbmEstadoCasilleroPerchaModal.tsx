//Dependencias para validar los formularios
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
 
     useEffect(() => {
        const fetchDatos = async () => {
            try {
                const datosEstadoCasilleroPercha: EstadoCasilleroPercha[] = await EstadoCasilleroPerchaService.getEstados();
                setEstadoCasilleroPercha(datosEstadoCasilleroPercha);
            } catch (error) {
                console.log(error);
            }
        }
        fetchDatos();
    }, []);

    //Esquema de validacion
    const validationSchema = () => {
        return Yup.object().shape({
        id: Yup.number().integer().min(0),
        nombreEstadoCasilleroPercha: Yup.string().required('El nombre es requerido'),
        colorEstadoCasilleroPercha: Yup.string().required('El color es requerido'),
        fechaAltaEstadoCasilleroPercha: Yup.string().required('La fecha es requerida'),
        
      

    })
    };
    const formik = useFormik({
        initialValues: estadoCasilleroPercha,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (estado: EstadoCasilleroPercha) => handleSaveUpdate(estado)
    });

    //Bajas
    const handleDelete = async () => {
        try {
            await EstadoCasilleroPerchaService.deleteEstado(estadoCasilleroPercha.id)
            toast.success("Estado borrado", {
                position: "top-center",
            });
            onHide();
            refreshData(prevState => !prevState) //prevState referencia al valor anterior del estado al que estamos modificando con el setRefreshData
        } catch (error) {
            toast.error("Ha ocurrido un error borrando el estado")
            console.log(error);
        }
    };

    //Altas y Modificaciones 
    const handleSaveUpdate = async (estadoCasilleroPercha: EstadoCasilleroPercha) => {
        try {
            // Validar y depurar el objeto estadoCasilleroPercha
            console.log('Datos a enviar:', estadoCasilleroPercha);
        
            const isNew = estadoCasilleroPercha.id === 0;
            if (isNew) {
                await EstadoCasilleroPerchaService.createEstado(estadoCasilleroPercha);
            } else {
                estadoCasilleroPercha.fechaModificacionEstadoCasilleroPercha = estadoCasilleroPercha.fechaAltaEstadoCasilleroPercha;
                await EstadoCasilleroPerchaService.updateEstado(estadoCasilleroPercha.id, estadoCasilleroPercha);
            }
            toast.success(isNew ? "Estado creado c  on éxito" : "Estado actualizado con éxito", {
                position: "top-center",
            });
            onHide();
            refreshData(prevState => !prevState);
        } catch (error) {
            console.error('Error al guardar/actualizar el estado:', error);
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
                <p> ¿Está seguro que desea eliminar el estado?
                    <br /> <strong> {estadoCasilleroPercha.id} </strong> ?
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
    )
     : (
        <Modal show={showModal} centered backdrop="static">

            <Modal.Header closeButton onClick={onHide}>
                <Modal.Title>{tituloModal}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>

                            <Form.Group controlId="formNombreEstadoCasilleroPercha" className="mt-3">
                              <Form.Label>Nombre del estado: </Form.Label>
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

                            <Form.Group controlId="formColorEstadoCasilleroPercha" className="mt-3">
                                <Form.Label>Color del estado: </Form.Label>
                                <Form.Control
                                  name="colorEstadoCasilleroPercha"
                                  type="color"
                                  value={formik.values.colorEstadoCasilleroPercha || "#000000"} // Valor por defecto negro si no hay valor
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isInvalid={!!formik.errors.colorEstadoCasilleroPercha && formik.touched.colorEstadoCasilleroPercha}
                                  style={{ height: '40px', padding: '2px' }} // Ajusta el estilo según sea necesario
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.colorEstadoCasilleroPercha}
                                </Form.Control.Feedback>
                            </Form.Group>

                      
                            <Form.Group controlId="formFechaAltaEstadoCasilleroPercha">
                                <FormLabel>Fecha Actual: </FormLabel>
                                <Form.Control
                                  name="fechaAltaEstadoCasilleroPercha"
                                  type="date"
                                  value={formik.values.fechaAltaEstadoCasilleroPercha || new Date().toISOString().split('T')[0]}
                                  onChange={(e) => {
                                    formik.setFieldValue('fechaAltaEstadoCasilleroPercha', e.target.value);
                                  }}
                                  onBlur={formik.handleBlur}
                                  isInvalid={!!formik.errors.fechaAltaEstadoCasilleroPercha && formik.touched.fechaAltaEstadoCasilleroPercha}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.fechaAltaEstadoCasilleroPercha}
                                </Form.Control.Feedback>
                            </Form.Group>

 
                            

                                <br />

            <hr />
            
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
  )
}

export default AbmEstadoCasilleroPerchaModal