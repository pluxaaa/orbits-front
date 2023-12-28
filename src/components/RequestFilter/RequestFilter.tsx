import React, { FC } from 'react';
import { Button, Col, Form, FormLabel, FormSelect, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setReqStatus, setReqStart, setReqEnd, setReqClientSl } from '../../store/newFilter';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import store from '../../store/store';
import "./RequestFilter.styles.css"

interface RequestFilterProps {
    status: string | null | undefined;
    setStatus: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setReqStatus">;
    reqStartDate: string | null | undefined;
    setReqStartDate: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setReqStart">;
    reqFinDate: string | null | undefined;
    setReqFinDate: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, "data/setReqEnd">;
    reqClient: string | null | undefined;
    setReqClient: React.Dispatch<React.SetStateAction<string | undefined>> | ActionCreatorWithPayload<string, 'data/setReqClientSl'>;
    allClients: string[];
    applyFilters: () => void;
    clearFilters: () => void;
}

const RequestFilter: FC<RequestFilterProps> = ({
    status,
    setStatus,
    reqStartDate,
    setReqStartDate,
    reqFinDate,
    setReqFinDate,
    reqClient,
    setReqClient,
    allClients,
    applyFilters,
    clearFilters
}) => {
    const { userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const dispatch = useDispatch();

    return (
        <div className="request-filter-container">
            {userRole == '1' &&
                <Form className="request-filter-form">
                    <Row>
                        <Col>
                            <FormLabel className="request-filter-label">Статус:</FormLabel>
                        </Col>
                        <Col>
                            <FormSelect
                                className="request-filter-select"
                                value={status?.toString()}
                                onChange={(e) => {
                                    dispatch(setReqStatus(e.target.value));
                                    setStatus(e.target.value);
                                }}
                            >
                                <option value="client">Все</option>
                                <option value="На рассмотрении">На рассмотрении</option>
                                <option>Оказана</option>
                                <option>Отклонена</option>
                            </FormSelect>
                        </Col>
                    </Row>
                </Form>
            }
            {userRole === '2' &&
                <div className="label-container">
                    <Row>
                        <Col>
                            <label className="date-label">Дата начала:</label>
                            <input
                                type="date"
                                className="date-input"
                                value={reqStartDate?.toString()}
                                onChange={(e) => {
                                    dispatch(setReqStart(e.target.value));
                                    setReqStartDate(e.target.value);
                                }}
                            />
                        </Col>
                        <Col>
                            <label className="date-label">Дата конца:</label>
                            <input
                                type="date"
                                className="date-input"
                                value={reqFinDate?.toString()}
                                onChange={(e) => {
                                    dispatch(setReqEnd(e.target.value));
                                    setReqFinDate(e.target.value);
                                }}
                            />
                        </Col>
                        <Col>
                            <Form.Label className="request-filter-label">Клиент:</Form.Label>
                            <Form.Select
                                className="request-filter-select"
                                value={reqClient?.toString()}
                                onChange={(e) => {
                                    dispatch(setReqClientSl(e.target.value));
                                    setReqClient(e.target.value);
                                }}
                            >
                                <option value="">Выберите клиента</option>
                                {allClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
            }
            <Row>
                <Col><Button className="button" onClick={applyFilters}>Применить</Button></Col>
                <Col><Button className="button" onClick={clearFilters}>Очистить</Button></Col>
            </Row>
        </div>
    );
}

export default RequestFilter;
