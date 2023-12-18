import { FC, useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from "react-router-dom";
import RequestFilter from '../../components/RequestFilter/RequestFilter';
import TransfReqCard from '../../components/TransfReqCard/TransfReqCard';
import { TransferRequest } from '../../modules/ds';
import getRequestByStatus from '../../modules/get-req-by-status';
import filtersSlice from "../../store/filtersSlice";
import store, { useAppDispatch } from '../../store/store';
import "./RequestsAllPage.styles.css";

const TransfReq: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { requestStatus } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const [transfReqs, setTransfReqs] = useState<TransferRequest[]>([])
    const [status, setStatus] = useState(requestStatus);

    useEffect(() => {
        const loadValidRequests = async () => {
                const result = (await getRequestByStatus(userToken?.toString(), userRole, userName, 'client'))
                if (!result){
                    return
                }
                setTransfReqs(result)
        }
        loadValidRequests()
    }, []);

    const applyFilters = async () => {
        try {
            dispatch(filtersSlice.actions.setRequestStatus(status));
            
        if (status != undefined){
            const result = (await getRequestByStatus(userToken?.toString(), userRole, userName, status?.toString()))
            if (!result){
                return
            }
            setTransfReqs(result)

            navigate('/transfer_requests', { state: { result } });
        }
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
        }
    };


    return (
        <>
            {!userToken &&
                <h3 style={{ textAlign: 'center', fontSize: '2em', margin: 'auto', padding: 100 }}>
                    Вам необходимо войти в систему!
                </h3>
            }
            {userToken && transfReqs.length == 0 &&
                <h3> Заявки не найдены</h3>
            }
            <RequestFilter
                status={status}
                setStatus={setStatus}
                applyFilters={applyFilters}>
            </RequestFilter>
            <Row xs={4} md={4} className='g-4' >
                {transfReqs.map((item, index) => (
                    <Col key={index}>
                        <TransfReqCard {...{
                            id: item.ID,
                            status: item.Status,
                            dateCreated: item.DateCreated,
                            dateProcessed: item.DateProcessed,
                            dateFinished: item.DateFinished,
                        }}></TransfReqCard>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default TransfReq