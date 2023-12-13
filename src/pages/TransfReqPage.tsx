import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { Row, Col } from 'react-bootstrap'

import TransfReqCard from '../components//TransfReqCard/TransfReqCard'
import store from '../store/store'
import { getTransfReqs } from '../modules/get-all-requests'
import { TransferRequest } from '../modules/ds'


const TransfReq: FC = () => {
    const {userToken, userRole, userName} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [transfReqs, setTransfReqs] = useState<TransferRequest[]>([])

    useEffect(() => {
        const loadTransfReqs = async()  => {
            if (userToken !== undefined) {
                const result = (await getTransfReqs(userToken?.toString(), '')).filter((item) => {
                    if (userRole === '1') {
                        return item.Client?.Name === userName;
                    } else {
                        console.log(userName)
                        return item.Moder?.Name === userName;
                    }
                  });
                setTransfReqs(result)
            }
        }

        loadTransfReqs()

    }, []);

    return (
        <>
            {!userToken &&
                <h3> Вам необходимо войти в систему! </h3>

            }
            {userToken && transfReqs.length == 0 &&
                <h3> Заявки не найдены</h3>
            }
            <Row xs={4} md={4} className='g-4' >
                {transfReqs.map((item, index) => (
                    <Col key={index}> 
                        <TransfReqCard {...{
                            status: item.Status,
                            dateCreated: item.DateCreated,
                            dateFinished: item.DateFinished,
                        }}></TransfReqCard>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default TransfReq