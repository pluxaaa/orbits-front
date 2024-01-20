import { FC, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../components/Pagination/usePagination';
import RequestFilter from '../../components/RequestFilter/RequestFilter';
import getRequestByStatus from '../../modules/getRequestByStatus';
import store, { useAppDispatch } from '../../store/store';
import { formatDate } from '../../modules/formatDate';
import {
    useReqStatus,
    useReqStart,
    useReqEnd,
    useReqClient,
    useRequest,
    setReqStatus,
    setReqStart,
    setReqEnd,
    setReqClientSl,
    setRequest,
} from '../../store/newFilter';
import './RequestsAllPage.styles.css';
import { changeReqStatusModer } from '../../modules/changeRequestStatusModer';

const TransfReq: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const reqStatus = useReqStatus();
    const reqStartDate = useReqStart();
    const reqFinDate = useReqEnd();
    const reqClient = useReqClient();
    const request = useRequest();

    const [allClients, setAllClients] = useState<string[]>([]);
    const [flag, setFlag] = useState<boolean | false>();

    const {
        currentPage,
        currentItems,
        pageCount,
        paginate,
        goToNextPage,
        goToPrevPage,
    } = usePagination(request, 5);

    useEffect(() => {
        const loadValidRequests = async () => {
            const result = await getRequestByStatus(userToken?.toString(), userRole, userName, reqStatus || "client", reqStartDate || "", reqFinDate || "", /*reqClient*/);
            if (result) {
                dispatch(setRequest(result));

                if (userRole === '2') {
                    const uniqueClientRefers: string[] = Array.from(new Set(result.map(item => item.Client?.Name || '')));
                    setAllClients(uniqueClientRefers)
                    if (reqClient !== '') {
                        const filteredRequests = result.filter(
                            (request) => request.Client && request.Client.Name === reqClient
                        );
                        dispatch(setRequest(filteredRequests));
                    }
                }
            }
        };
        loadValidRequests();
    }, [flag]);

    // short-polling
    useEffect(() => {
        const intervalId = setInterval(() => {
            const loadPollRequests = async () => {
                const result = await getRequestByStatus(
                    userToken?.toString(),
                    userRole,
                    userName, reqStatus || "client",
                    reqStartDate || "",
                    reqFinDate || ""
                );
                if (result) {
                    dispatch(setRequest(result));
                }
            };
            loadPollRequests();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [userToken, userRole, userName, reqStatus, reqStartDate, reqFinDate, reqClient]);

    const applyFilters = async () => {
        try {
            if (reqStatus === '') {
                dispatch(setReqStatus('client'));
            }

            dispatch(setReqStart(reqStartDate || ""));
            dispatch(setReqEnd(reqFinDate || ""));
            dispatch(setReqClientSl(reqClient || ""));

            const result = await getRequestByStatus(userToken?.toString(),
                userRole, userName,
                reqStatus || "client",
                reqStartDate || "",
                reqFinDate || ""
            );

            if (result) {
                // фильтр по клиенту
                if (reqClient !== '') {
                    const filteredRequests = result.filter(
                        (request) => request.Client && request.Client.Name === reqClient
                    );
                    dispatch(setRequest(filteredRequests));
                    navigate('/transfer_requests', { state: { result } });
                } else {
                    dispatch(setRequest(result));
                    navigate('/transfer_requests', { state: { result } });
                }
            }
        } catch (error) {
            console.error('Ошибка при получении заявок:', error);
        }
    };


    const clearFilters = async () => {

        dispatch(setReqStatus(""));
        dispatch(setReqStart(""));
        dispatch(setReqEnd(""));
        dispatch(setReqClientSl(""));

        try {
            const result = await getRequestByStatus(userToken?.toString(),
                userRole, userName, 'client', '', '', /*''*/);
            if (result) {
                dispatch(setRequest(result));
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }

    };

    const sendChanges = async (status: string, id: number) => {
        if (!userToken || "" === undefined) {
            console.log("Ошибка токена или ID");
            return;
        }

        try {
            await changeReqStatusModer(userToken, {
                ID: id,
                Status: status,
            });

            setFlag(!flag);
        } catch (error) {
            console.log("error")
        }
    };

    return (
        <>
            {!userToken && (
                <>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h3>Вам необходимо войти в систему</h3>
                        <Button
                            className="button"
                            onClick={() => navigate(`/login`)}
                            style={{ marginTop: '10px' }}>
                            Войти
                        </Button>
                    </div>
                </>
            )}
            {userToken && (
                <>
                    <RequestFilter
                        status={reqStatus}
                        setStatus={setReqStatus}
                        reqStartDate={reqStartDate}
                        setReqStartDate={setReqStart}
                        reqFinDate={reqFinDate}
                        setReqFinDate={setReqEnd}
                        reqClient={reqClient}
                        setReqClient={setReqClientSl}
                        allClients={allClients}
                        applyFilters={applyFilters}
                        clearFilters={clearFilters}>
                    </RequestFilter>
                    {request.length === 0 && <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
                        Заявки не найдены</h3>}

                    {request.length !== 0 && (
                        <>
                            <Table striped bordered hover responsive className="custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {userRole == '2' && <th>Инициатор</th>}
                                        <th>Статус</th>
                                        <th>Успех маневра</th>
                                        <th>Создана</th>
                                        <th>Сформирована</th>
                                        <th>Завршена</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        item.Status !== 'Отклонена' && item.Status !== 'Одобрена' && (
                                            <tr key={index}>
                                                <td style={{ width: '10px' }}>{item.ID}</td>
                                                {userRole == '2' && <td style={{ width: '50px' }}>{item.Client?.Name}</td>}
                                                <td style={{ width: '50px' }}>{item.Status}</td>
                                                <td style={{ width: '200px' }}>
                                                    {item.Result ?
                                                        (item.Result === true ?
                                                            'Маневр успешен' :
                                                            'Маневр может не удастся'
                                                        ) :
                                                        'Нет информации'
                                                    }
                                                </td>
                                                <td style={{ width: '50px' }}>{formatDate(item.DateCreated)}</td>
                                                <td style={{ width: '50px' }}>{formatDate(item.DateProcessed)}</td>
                                                <td style={{ width: '50px' }}>{formatDate(item.DateFinished)}</td>
                                                <td style={{ width: '200px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Button
                                                            style={{ width: '205px', backgroundColor: '#0E3E8DFF' }}
                                                            onClick={() => navigate(`/transfer_requests/${item.ID}`)}>
                                                            Подробнее
                                                        </Button>

                                                        <div style={{ display: 'block', flexDirection: 'row' }}>
                                                            <Button
                                                                style={{ width: '100px', marginRight: '5px' }}
                                                                variant="warning"
                                                                onClick={() => sendChanges('Отклонена', item.ID)}>
                                                                Отклонить
                                                            </Button>
                                                            <Button
                                                                style={{ width: '100px' }}
                                                                variant="success"
                                                                onClick={() => sendChanges('Одобрена', item.ID)}>
                                                                Одобрить
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </Table>
                            <div>
                                {request.length > 5 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        pageCount={pageCount}
                                        goToNextPage={goToNextPage}
                                        goToPrevPage={goToPrevPage}
                                        paginate={paginate}
                                    />
                                )}
                            </div>

                        </>)}
                </>)}
        </>
    );
};

export default TransfReq;
