import {FC} from 'react'
import {Button, Card} from 'react-bootstrap'
import './OrbitCard.css'

interface Props {
    imageUrl: string
    orbitName: string
    pageUrl: string
}

const OrbitCard: FC<Props> = ({ imageUrl, orbitName, pageUrl }) => (
    <Card className='card'>
        <Card.Img className="cardImage" variant="top" src={"data:image/jpg;base64, " + {imageUrl}} height = {100} width = {100} />
        <Card.Body>
            <div className='textStyle'>
                <Card.Title> {orbitName} </Card.Title>
            </div>
        <Button className='cardButton' href={pageUrl}> Подробнее </Button>
        </Card.Body>
    </Card>
)

export default OrbitCard;