import { AwesomeButton } from 'react-awesome-button'

function CareerButtons(){
    return(
        <div className='d-flex justify-content-evenly'>
            <AwesomeButton type='primary'>Sistemas</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Civil</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Energía Eléctrica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Electrónica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Industrial</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Mecánica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Naval</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Química</AwesomeButton>
            <AwesomeButton type='primary' disabled={true}>Textil</AwesomeButton>
        </div>
    )
}

export default CareerButtons