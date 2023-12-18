import { FC, useEffect, useState } from 'react';
import { Col, Row, Table, Button } from "react-bootstrap";
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from "react-router-dom";
import RequestFilter from '../../components/RequestFilter/RequestFilter';
import { TransferRequest } from '../../modules/ds';
import getRequestByStatus from '../../modules/get-req-by-status';
import filtersSlice from "../../store/filtersSlice";
import store, { useAppDispatch } from '../../store/store';
import "./RequestsAllPage.styles.css"

const TransfReq: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { requestStatus } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const [transfReqs, setTransfReqs] = useState<TransferRequest[]>([])
    const [status, setStatus] = useState(requestStatus);

    useEffect(() => {
        const loadValidRequests = async () => {
            const result = await getRequestByStatus(userToken?.toString(), userRole, userName, 'client');
            if (result) {
                setTransfReqs(result);
            }
        }
        loadValidRequests();
    }, []);

    const applyFilters = async () => {
        try {
            if (status === '') { setStatus('client') }
            dispatch(filtersSlice.actions.setRequestStatus(status));

            if (status != undefined) {
                const result = await getRequestByStatus(userToken?.toString(), userRole, userName, status?.toString());
                if (result) {
                    setTransfReqs(result);
                    navigate('/transfer_requests', { state: { result } });
                }
            }
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return '-';
        }

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const date = new Date(dateString);

        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    };

    return (
        <>
            {!userToken && (<>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h3>Вам необходимо войти в систему</h3>
                    <Button className='button' onClick={() => (navigate(`/auth`))} variant="primary" style={{ marginTop: '10px' }}>
                        Войти
                    </Button>
                </div>
            </>)}
            {userToken && transfReqs.length === 0 &&
                <h3> Заявки не найдены</h3>
            }
            {userToken && transfReqs.length !== 0 && (
                <>
                    <RequestFilter
                        status={status}
                        setStatus={setStatus}
                        applyFilters={applyFilters}>
                    </RequestFilter>
                    <Table striped bordered hover responsive className="custom-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Статус</th>
                                <th>Создана</th>
                                <th>На рассмотрении</th>
                                <th>Завршена</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfReqs.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.ID}</td>
                                    <td>{item.Status}</td>
                                    <td>{formatDate(item.DateCreated)}</td>
                                    <td>{formatDate(item.DateProcessed)}</td>
                                    <td>{formatDate(item.DateFinished)}</td>
                                    <td>
                                        <button onClick={() => navigate(`/transfer_requests/${item.ID}`)}>
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>)}
        </>
    )
}

export default TransfReq;
