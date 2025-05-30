import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { Usuario } from "../../Types/Usuario";
import type { RegisterRequest } from "../../Types/RegisterRequest";
import { useEffect, useState } from "react";
import { ModalType } from "../../enums/ModalTypes";
import { Button, Form, Modal } from "react-bootstrap";
import { UsuarioService } from "../../Services/UsuarioService";
import { AuthService } from "../../Services/AuthServices";
import type { UsuarioModifyDTO } from "../../Types/UsuarioModifyDTO";
import { Role } from "../../enums/Role";

type AbmUsuarioModalProps = {
  tituloModal: string;
  showModal: boolean;
  onHide: () => void;
  modalType: ModalType;
  usuario: Usuario;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AbmUsuarioModal = ({
  tituloModal,
  showModal,
  onHide,
  modalType,
  usuario,
  refreshData,
}: AbmUsuarioModalProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const datos = await UsuarioService.getUsuarios();
        setUsuarios(datos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuarios();
  }, []);

  const isNew = usuario.id === 0;

  const validationSchema = Yup.object().shape({
    username: Yup.string().when([], {
      is: () => isNew,
      then: (schema) => schema.required("El username es obligatorio"),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string().when([], {
      is: () => isNew,
      then: (schema) => schema.required("La contraseña es obligatoria"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nombreUsuario: Yup.string().required("El nombre es obligatorio"),
    dniUsuario: Yup.number().min(1).required("El DNI es obligatorio"),
    telefonoUsuario: Yup.number().required("El teléfono es obligatorio"),
    emailUsuario: Yup.string().email("Email inválido").required("Email es obligatorio"),
    descripcionUsuario: Yup.string().required("La descripción es obligatoria"),
  });

  const formik = useFormik({
    initialValues: {
      ...usuario,
      username: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: any) => handleSaveUpdate(values),
    enableReinitialize: true,
  });

  const handleDelete = async () => {
  try {
    await AuthService.deleteUsuario(usuario.id);
    toast.success("Usuario dado de baja");
    onHide();
    refreshData((prev) => !prev);
  } catch (error) {
    toast.error("Error al dar de baja el usuario");
  }
};

  const handleRestore = async () => {
    try {
      await AuthService.restaurarUsuario(usuario.id);
      toast.success("Usuario dado de alta");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al dar de alta el usuario");
    }
  };

  const handleSaveUpdate = async (values: any) => {
    try {
      const isNew = values.id === 0;
      // Validar dni único para nuevo usuario
      if (isNew) {
        const dniRepetido = usuarios.find((u) => u.dniUsuario === values.dniUsuario);
        if (dniRepetido) {
          toast.error("El DNI ya está registrado");
          return;
        }
      }

      let action;
      if (isNew) {
        // Map Usuario to RegisterRequest
        const registerRequest: RegisterRequest = {
          username: values.username,
          password: values.password,
          nombreUsuario: values.nombreUsuario,
          telefonoUsuario: values.telefonoUsuario,
          dniUsuario: values.dniUsuario,
          emailUsuario: values.emailUsuario,
          descripcionUsuario: values.descripcionUsuario,
        };
        action = AuthService.register(registerRequest);
      } else {
        const usuarioModifyDTO: UsuarioModifyDTO = {
        idUsuario: values.id,
        idRole: values.idRole || 2, 
        nombreUsuario: values.nombreUsuario,
        apellidoUsuario: values.apellidoUsuario,
        telefonoUsuario: values.telefonoUsuario,
        dniUsuario: values.dniUsuario,
        descripcionUsuario: values.descripcionUsuario,
        emailUsuario: values.emailUsuario,
        fechaHoraModificacionUsuario: null, 
      };
      await AuthService.modifyUsuario(usuarioModifyDTO);
      }
      await action;
      toast.success(isNew ? "Usuario creado" : "Usuario actualizado");
      onHide();
      refreshData((prev) => !prev);
    } catch (error) {
      toast.error("Error al guardar el usuario");
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
                ¿Está seguro que desea dar de <strong>baja</strong> el usuario con ID:{" "}
                <strong>{usuario.id}</strong>?
              </p>
            ) : (
              <p>
                ¿Está seguro que desea <strong>dar de alta</strong> el usuario con ID:{" "}
                <strong>{usuario.id}</strong>?
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
              {isNew && (
                <>
                  <Form.Group className="mt-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      type="text"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.username && !!formik.touched.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {typeof formik.errors.username === "string" ? formik.errors.username : ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!formik.errors.password && !!formik.touched.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {typeof formik.errors.password === "string" ? formik.errors.password : ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mt-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombreUsuario"
                  type="text"
                  value={formik.values.nombreUsuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.nombreUsuario && !!formik.touched.nombreUsuario}
                />
                <Form.Control.Feedback type="invalid">
                  {typeof formik.errors.nombreUsuario === "string" ? formik.errors.nombreUsuario : ""}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  name="dniUsuario"
                  type="number"
                  value={formik.values.dniUsuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.dniUsuario && !!formik.touched.dniUsuario}
                />
                <Form.Control.Feedback type="invalid">
                  {typeof formik.errors.dniUsuario === "string" ? formik.errors.dniUsuario : ""}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="telefonoUsuario"
                  type="number"
                  value={formik.values.telefonoUsuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.telefonoUsuario && !!formik.touched.telefonoUsuario}
                />
                <Form.Control.Feedback type="invalid">
                  {typeof formik.errors.telefonoUsuario === "string" ? formik.errors.telefonoUsuario : ""}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="emailUsuario"
                  type="email"
                  value={formik.values.emailUsuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.emailUsuario && !!formik.touched.emailUsuario}
                />
                <Form.Control.Feedback type="invalid">
                  {typeof formik.errors.emailUsuario === "string" ? formik.errors.emailUsuario : ""}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  name="descripcionUsuario"
                  type="text"
                  value={formik.values.descripcionUsuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.descripcionUsuario && !!formik.touched.descripcionUsuario}
                />
                <Form.Control.Feedback type="invalid">
                  {typeof formik.errors.descripcionUsuario === "string" ? formik.errors.descripcionUsuario : ""}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="idRole"
                value={formik.values.idRole || Role.EMPLEADO}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.idRole && !!formik.touched.idRole}
              >
                <option value={Role.ADMIN}>Administrador</option>
                <option value={Role.EMPLEADO}>Empleado</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {typeof formik.errors.idRole === "string" ? formik.errors.idRole : ""}
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

export default AbmUsuarioModal;