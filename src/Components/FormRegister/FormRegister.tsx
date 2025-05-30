import { useFormik } from "formik";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../../Services/AuthServices";
import './FormRegister.css'; // Archivo CSS que crearemos después

const FormRegister: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  // YUP - Esquema de validación
  const validationSchema = yup.object().shape({
    username: yup.string().required("Este campo es obligatorio"),
    password: yup.string().required("Este campo es obligatorio"),
    nombreUsuario: yup.string().required("El nombre es obligatorio"),
    telefonoUsuario: yup
      .number()
      .required("El nro del telefono es obligatorio")
      .integer("Debe ser un número entero")
      .positive("Debe ser mayor a 0"),
    dniUsuario: yup
      .number()
      .required("El nro del DNI es obligatorio")
      .integer("Debe ser un número entero")
      .positive("Debe ser mayor a 0"),
    emailUsuario: yup.string().email("Formato de correo electrónico inválido").required("Este campo es obligatorio"),
    descripcionUsuario: yup.string().required("La descripción es obligatoria"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      username: "",
      password: "",
      nombreUsuario: "",
      telefonoUsuario: 0,
      dniUsuario: 0,
      emailUsuario: "",
      descripcionUsuario: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = await AuthService.register(values);
        console.log("Registro realizado. Token:", token);
        toast.success("Registro realizado");
        navigate("/");
      } catch (error) {
        console.error("Error al registrarse");
      }
    },
  });

  const handleHide = () => {
    setShow(false);
    navigate("/");
  };

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className="register-form">
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.username && formik.touched.username)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.password && formik.touched.password)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="nombreUsuario">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombreUsuario"
              type="text"
              value={formik.values.nombreUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.nombreUsuario && formik.touched.nombreUsuario)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nombreUsuario}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="dniUsuario">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              name="dniUsuario"
              type="number"
              value={formik.values.dniUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.dniUsuario && formik.touched.dniUsuario)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.dniUsuario}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="telefonoUsuario">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="telefonoUsuario"
              type="number"
              value={formik.values.telefonoUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.telefonoUsuario && formik.touched.telefonoUsuario)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.telefonoUsuario}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="emailUsuario">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="emailUsuario"
              type="text"
              value={formik.values.emailUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.emailUsuario && formik.touched.emailUsuario)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.emailUsuario}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="descripcionUsuario">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              name="descripcionUsuario"
              type="text"
              value={formik.values.descripcionUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.descripcionUsuario && formik.touched.descripcionUsuario)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descripcionUsuario}
            </Form.Control.Feedback>
          </Form.Group>

          <Modal.Footer className="mt-4">
            <Button variant="secondary" onClick={handleHide}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid}>
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormRegister;
