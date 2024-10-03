import { AwesomeButton } from 'react-awesome-button'
import Swal from 'sweetalert2';

function CareerButtons(){
    const vago = ()=>{
        Swal.fire({
            title: "Esto todavía no lo agregué. Soy medio vago.",
            showDenyButton: false,
            confirmButtonText: "Ta bien.",
            background: 'black',
            color: 'white',
            confirmButtonColor: 'green'
            })
    }
    return(
        <div className='d-flex justify-content-evenly flex-wrap'>
            <AwesomeButton type='primary' className='mt-2'>Sistemas</AwesomeButton>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Civil</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Energía Eléctrica</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Electrónica</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Industrial</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Mecánica</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Naval</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Química</AwesomeButton>
            </div>
            <div onClick={vago}>
                <AwesomeButton type='primary' disabled={true} className='mt-2'>Textil</AwesomeButton>
            </div>
        </div>
    )
}

export default CareerButtons