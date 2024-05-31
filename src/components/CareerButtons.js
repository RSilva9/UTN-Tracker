import { AwesomeButton } from 'react-awesome-button'

function CareerButtons(){
    return(
        <div className='d-flex justify-content-evenly'>
            <AwesomeButton type='primary'>Sistemas</AwesomeButton>
            <AwesomeButton type='danger'>Civil</AwesomeButton>
            <AwesomeButton type='danger'>Energía Eléctrica</AwesomeButton>
            <AwesomeButton type='danger'>Electrónica</AwesomeButton>
            <AwesomeButton type='danger'>Industrial</AwesomeButton>
            <AwesomeButton type='danger'>Mecánica</AwesomeButton>
            <AwesomeButton type='danger'>Naval</AwesomeButton>
            <AwesomeButton type='danger'>Química</AwesomeButton>
            <AwesomeButton type='danger'>Textil</AwesomeButton>
        </div>
    )
}

export default CareerButtons