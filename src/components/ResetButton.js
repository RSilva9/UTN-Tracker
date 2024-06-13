import Swal from "sweetalert2"
import { AwesomeButton } from "react-awesome-button"
import { TrashIcon } from "@primer/octicons-react"

function ResetButton(){
    const resetProgress = ()=>{
        Swal.fire({
            title: "¿Estás seguro de querer reiniciar tu progreso?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Seguro",
            denyButtonText: `Era joda`,
            background: 'black',
            color: 'white',
            confirmButtonColor: 'green'
            }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear()
                window.location.reload()
            } else if (result.isDenied) {
                return
            }
        });
    }

    return(
        <AwesomeButton 
            type="danger"
            onPress={()=>{resetProgress()}}
            className="ms-3 mt-5"
            >
                <TrashIcon />
                Reiniciar progreso
        </AwesomeButton>
    )
}

export default ResetButton