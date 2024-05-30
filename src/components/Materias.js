import { useEffect, useState } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import useHorizontalScroll from '@revolt-digital/use-horizontal-scroll'

function Materias(){
    const [materias, setMaterias] = useState([])
    const [cursadas, setCursadas] = useState(JSON.parse(localStorage.getItem("cursadas")) || [])
    const [aprobadas, setAprobadas] = useState(JSON.parse(localStorage.getItem("aprobadas")) || [])
    const { ref } = useHorizontalScroll();
    const niveles = [1, 2, 3, 4, 5];

    useEffect(()=>{
        getMaterias()
    }, [])

    useEffect(()=>{
        localStorage.setItem("cursadas", JSON.stringify(cursadas))
    }, [cursadas])

    useEffect(()=>{
        localStorage.setItem("aprobadas", JSON.stringify(aprobadas))
    }, [aprobadas])

    const getMaterias = async()=>{
        const response = await fetch("/carreras/sistemas.json")
        const fetchedMaterias = await response.json()
        setMaterias(fetchedMaterias)
    }

    const toggleCursadas = (numero) => {
        setCursadas(prevCursadas => 
            prevCursadas.includes(numero) 
                ? prevCursadas.filter(n => n !== numero) 
                : [...prevCursadas, numero]
        );
    };

    const toggleAprobadas = (numero) => {
        setAprobadas(prevAprobadas => 
            prevAprobadas.includes(numero) 
                ? prevAprobadas.filter(n => n !== numero) 
                : [...prevAprobadas, numero]
        );
    };

    return (
        <div id='scroll' ref={ref}>
            <div className='materiasContainer'>
                {niveles.map(nivel => (
                    <div className='nivelBlock' key={nivel}>
                        {materias.filter(mat => mat.nivel === nivel).map(mat => (
                            <div 
                                key={mat.numero} 
                                className={`materia ${cursadas.includes(mat.numero) ? "" : "no-cursada"} ${aprobadas.includes(mat.numero) ? "aprobada" : ""}`}
                            >
                                <h2>{mat.nombre}</h2>
                                <div className='d-flex'>
                                    <div className='me-4'>
                                        <label htmlFor={`Cursada-${mat.numero}`}>Cursada</label>
                                        <input 
                                            id={`Cursada-${mat.numero}`} 
                                            name="Cursada" 
                                            type='checkbox' 
                                            onChange={() => toggleCursadas(mat.numero)} 
                                            checked={cursadas.includes(mat.numero)} 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`Aprobada-${mat.numero}`}>Aprobada</label>
                                        <input 
                                            id={`Aprobada-${mat.numero}`} 
                                            name="Aprobada" 
                                            type='checkbox' 
                                            onChange={() => toggleAprobadas(mat.numero)} 
                                            checked={aprobadas.includes(mat.numero)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Materias