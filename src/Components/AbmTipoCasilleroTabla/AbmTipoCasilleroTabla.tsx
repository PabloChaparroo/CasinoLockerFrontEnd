import React, { useEffect, useState } from 'react';
import type { TipoCasillero } from '../../Types/TipoCasillero';

import { toast } from 'react-toastify';
import { Button, Table } from 'react-bootstrap';
import { ModalType } from '../../enums/ModalTypes';
import Loader from '../Loader/Loader';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import AbmTipoCasilleroModal from '../AbmTipoCasilleroModal/AbmTipoCasilleroModal';
import { TipoCasilleroService } from '../../Services/TipoCasilleroService';

const AbmTipoCasilleroTabla = () => {
    const initializableNewTipoCasillero = (): TipoCasillero => {
        return {
            id: 0,
            nombreTipoCasillero: "",
            fechaAltaTipoCasillero: null,
            fechaModificacionTipoCasillero: null,
            fechaBajaTipoCasillero: null
        };
    };

    // Para el modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalType.NONE);
    const [tituloModal, setTituloModal] = useState("");

    // Para las entidades
    const [tipoCasillero, setTipoCasillero] = useState<TipoCasillero>(initializableNewTipoCasillero());
    const [tiposCasillero, setTiposCasillero] = useState<TipoCasillero[]>([]);
  
    // Para la tabla
    const [isLoading, setIsLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const datos = await TipoCasilleroService.getTiposCasillero();
                setTiposCasillero(datos);
                setIsLoading(false);
            } catch(error) {
                toast.error("Ha ocurrido un error al cargar los tipos de casillero");
                console.error(error);
            }
        };
        fetchDatos();
    }, [refreshData]);

    const handleClick = (tituloModal: string, tipo: TipoCasillero, modal: ModalType) => {
        setShowModal(true);
        setModalType(modal);
        setTipoCasillero(tipo);
        setTituloModal(tituloModal);
    };

    return (
        <>
            <div className="table-container tipo-casillero-container">
                <div className="table-header tipo-casillero-header">
                    <h4 className="table-title">ABM Tipo de Casillero</h4>
                    <div className="table-actions">
                        <Button
                            className="action-btn"
                            onClick={() =>
                                handleClick(
                                    'Crear Tipo de Casillero',
                                    initializableNewTipoCasillero(),
                                    ModalType.CREATE
                                )
                            }
                        >
                            Nuevo Tipo
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="table-wrapper">
                        <Table striped bordered hover responsive className="custom-table tipo-casillero-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Fecha Alta</th>
                                    <th>Fecha Modificación</th>
                                    <th>Fecha Baja</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tiposCasillero.map((tipo) => (
                                    <tr key={tipo.id}>
                                        <td>{tipo.id}</td>
                                        <td>{tipo.nombreTipoCasillero}</td>
                                        <td>{tipo.fechaAltaTipoCasillero || '-'}</td>
                                        <td>{tipo.fechaModificacionTipoCasillero || '-'}</td>
                                        <td>{tipo.fechaBajaTipoCasillero || '-'}</td>
                                        <td>
                                            <span className="me-2">
                                                <EditButton
                                                    onClick={() =>
                                                        handleClick(
                                                            'Editar Tipo de Casillero', 
                                                            tipo, 
                                                            ModalType.UPDATE
                                                        )
                                                    }
                                                />
                                            </span>
                                            <span>
                                                <DeleteButton
                                                    onClick={() =>
                                                        handleClick(
                                                            'Borrar Tipo de Casillero', 
                                                            tipo, 
                                                            ModalType.DELETE
                                                        )
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
                <AbmTipoCasilleroModal
                    tituloModal={tituloModal}
                    showModal={showModal}
                    onHide={() => setShowModal(false)}
                    modalType={modalType}
                    tipoCasillero={tipoCasillero}
                    refreshData={setRefreshData}
                />
            )}
        </>
    );
}

export default AbmTipoCasilleroTabla;