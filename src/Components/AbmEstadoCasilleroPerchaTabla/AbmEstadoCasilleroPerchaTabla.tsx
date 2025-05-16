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
    <div>
    <Button onClick={()=>handleClick("Crear Estado: ", initializableNewEstadoCasilleroPercha(), ModalType.CREATE)}>
            Nuevo Estado
    </Button>  
    </div>
    <div>
        {isLoading ? <Loader/> : (
            <div className="center-table-container table-shadow rounded p-4">
                <Table striped bordered hover className="w-auto">
                    <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Nombre Estado</th>
                            <th className="text-center">Fecha Alta</th>
                            <th className="text-center">Fecha Modificación</th>
                            <th className="text-center">Fecha Baja</th>
                            <th className="text-center">Color</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estadosCasilleroPercha.map(estado=>(
                            <tr key={estado.id}>
                                <td className="text-center">{estado.id}</td>
                                <td className="text-center">{estado.nombreEstadoCasilleroPercha}</td>
                                <td className="text-center">{estado.fechaAltaEstadoCasilleroPercha}</td>
                                <td className="text-center">{estado.fechaModificacionEstadoCasilleroPercha}</td>
                                <td className="text-center">{estado.fechaBajaEstadoCasilleroPercha}</td>
                                <td className="text-center">
                                <div 
                                    style={{
                                        backgroundColor: estado.colorEstadoCasilleroPercha,
                                        width: '20px',
                                        height: '20px',
                                        margin: '0 auto',
                                        border: '1px solid #ddd'
                                    }}
                                    title={estado.colorEstadoCasilleroPercha}
                                />
                                </td>
                                
                                <td className="text-center">
                                    <span className="me-2">
                                        <EditButton onClick={() => handleClick("Editar estado", estado, ModalType.UPDATE)}/>
                                    </span>
                                    <span>
                                        <DeleteButton onClick={() => handleClick("Borrar estado", estado, ModalType.DELETE)}/>
                                    </span>
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </Table>
            </div>
        )}
        </div>

        {showModal && <AbmEstadoCasilleroPerchaModal 
                      tituloModal={tituloModal} 
                      showModal={showModal}
                      onHide={() => setShowModal(false)} 
                      modalType={modalType} 
                      estadoCasilleroPercha={estadoCasilleroPercha}
                      refreshData={setRefreshData}/>}       
    </>
  )
}



export default AbmEstadoCasilleroPerchaTabla