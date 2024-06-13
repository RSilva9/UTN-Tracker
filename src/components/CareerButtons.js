import { AwesomeButton } from 'react-awesome-button'

function CareerButtons(){
    return(
        <div className='d-flex justify-content-evenly flex-wrap'>
            <AwesomeButton type='primary' className='mt-2'>Sistemas</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Civil</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Energía Eléctrica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Electrónica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Industrial</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Mecánica</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Naval</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Química</AwesomeButton>
            <AwesomeButton type='primary' disabled={true} className='mt-2'>Textil</AwesomeButton>
        </div>
    )
}

export default CareerButtons