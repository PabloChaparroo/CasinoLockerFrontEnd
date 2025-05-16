import React, { useEffect, useState } from 'react'
import type { EstadoCasilleroPercha } from '../../Types/EstadoCasilleroPercha';
import { EstadoCasilleroPerchaService } from '../../Services/EstadoCasilleroPerchaService';
import { toast } from 'react-toastify';
import { Button, Table } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import AbmEstadoCasilleroPerchaModal from '../AbmEstadoCasilleroPerchaModal/AbmEstadoCasilleroPerchaModal';
import './AbmEstadoCasilleroPercha.css';
const AbmEstadoCasilleroPerchaTabla = () => {

//Para evitar el undefined
    const initializableNewEstadoCasilleroPercha = ():EstadoCasilleroPercha=>{
        return {
            id: 0,
            nombreEstadoCasilleroPercha: "",
            fechaAltaEstadoCasilleroPercha: "",
            fechaModificacionEstadoCasilleroPercha: "",
            fechaBajaEstadoCasilleroPercha: "",
            colorEstadoCasilleroPercha: ""
        };
    };

     //Para el modal
    const [showModal, setShowModal] = useState(false);

    const [modalType, setModalType] = useState(ModalType.NONE);
    const [tituloModal, setTituloModal] = useState("");

    //Para las entidades
    const [estadoCasilleroPercha, setEstadoCasilleroPercha]=useState<EstadoCasilleroPercha>(initializableNewEstadoCasilleroPercha);
    const [estadosCasilleroPercha, setEstadosCasilleroPercha]=useState<EstadoCasilleroPercha[]>([]);
  

    //Para la tabla
    const [isLoading, setIsLoading]=useState(true);
    const [refreshData, setRefreshData]=useState(false);

    useEffect(()=>{
        const fetchDatos=async()=>{
            try{
                const datos = await EstadoCasilleroPerchaService.getEstados();
                setEstadosCasilleroPercha(datos);
                setIsLoading(false);
            }catch(error){
                toast.error("Ha ocurrido un error al cargar los proveedores") //mensaje de error
            }
        }
        fetchDatos();
    }, [refreshData]);

  const handleClick = (tituloModal:string, estadoCasilleroPercha: EstadoCasilleroPercha, modalType:ModalType)=>{
        setShowModal(true);
        setModalType(modalType);
        setEstadoCasilleroPercha(estadoCasilleroPercha);
        setTituloModal(tituloModal);
    }



  return (
        <>
        <div className="table-container">
            <div className="table-header">
                <h4 className="table-title">ABM Estado Casillero/Percha</h4>
                <div className="table-actions">
                    <Button
                        className="action-btn"
                         onClick={() =>
                          handleClick(
                         'Crear Estado: ',
                         initializableNewEstadoCasilleroPercha(),
                            ModalType.CREATE
                      )
        }
      >
        Nuevo Estado
      </Button>
    </div>
    </div>
  {isLoading ? (
    <Loader />
  ) : (
    <div className="table-wrapper">
      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Estado</th>
            <th>Fecha Alta</th>
            <th>Fecha Modificación</th>
            <th>Fecha Baja</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estadosCasilleroPercha.map((estado) => (
            <tr key={estado.id}>
              <td>{estado.id}</td>
              <td>{estado.nombreEstadoCasilleroPercha}</td>
              <td>{estado.fechaAltaEstadoCasilleroPercha}</td>
              <td>{estado.fechaModificacionEstadoCasilleroPercha}</td>
              <td>{estado.fechaBajaEstadoCasilleroPercha}</td>
              <td>
                <div
                  className="color-box"
                  style={{
                    backgroundColor: estado.colorEstadoCasilleroPercha,
                  }}
                  title={estado.colorEstadoCasilleroPercha}
                />
              </td>
              <td>
                <span className="me-2">
                  <EditButton
                    onClick={() =>
                      handleClick('Editar estado', estado, ModalType.UPDATE)
                    }
                  />
                </span>
                <span>
                  <DeleteButton
                    onClick={() =>
                      handleClick('Borrar estado', estado, ModalType.DELETE)
                    }
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )}
</div>

            {showModal && (
                <AbmEstadoCasilleroPerchaModal
                    tituloModal={tituloModal}
                    showModal={showModal}
                    onHide={() => setShowModal(false)}
                    modalType={modalType}
                    estadoCasilleroPercha={estadoCasilleroPercha}
                    refreshData={setRefreshData}
                />
            )}
        </>
    )
}



export default AbmEstadoCasilleroPerchaTabla