import { useEffect, useState } from 'react'
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

    const uncheckDepend = (numero, tipo) => {
        for (let mat of materias) {
            if (tipo === "cursada") {
                if (mat.cursadas.includes(numero) && cursadas.includes(mat.numero)) {
                    setCursadas(prevCursadas => {
                        const newCursadas = prevCursadas.filter(n => n !== mat.numero)
                        uncheckDepend(mat.numero, "cursada")
                        return newCursadas
                    })
                    setAprobadas(prevAprobadas => prevAprobadas.filter(n => n !== mat.numero))
                }
            } else {
                if (mat.aprobadas.includes(numero) && aprobadas.includes(mat.numero)) {
                    setCursadas(prevCursadas => {
                        const newCursadas = prevCursadas.filter(n => n !== mat.numero)
                        uncheckDepend(mat.numero, "aprobada")
                        return newCursadas
                    })
                    setAprobadas(prevAprobadas => prevAprobadas.filter(n => n !== mat.numero))
                }
            }
        }
    }

    const toggleCursadas = (numero) => {
        setCursadas(prevCursadas => {
            if(prevCursadas.includes(numero)){
                uncheckDepend(numero, "cursada")
                setAprobadas(prevAprobadas=> prevAprobadas.filter(n => n !== numero))
                return prevCursadas.filter(n => n !== numero) 
            }else{
                return [...prevCursadas, numero]
            }
        })
    }

    const toggleAprobadas = (numero) => {
        setAprobadas(prevAprobadas => {
            if (prevAprobadas.includes(numero)) {
                uncheckDepend(numero, "aprobada")
                return prevAprobadas.filter(n => n !== numero);
            } else {
                setCursadas(prevCursadas=> [...prevCursadas, numero])
                return [...prevAprobadas, numero];
            }
        })
    };

    const checker = (arr, target) => target.every(v => arr.includes(v));

    return (
        <div id='scroll' ref={ref}>
            <div className='materiasContainer'>
                {niveles.map(nivel => (
                    <div className='nivelBlock' key={nivel}>
                        {materias.filter(mat => mat.nivel === nivel).map(mat => (
                            <div 
                                key={mat.numero} 
                                className={`materia ${cursadas.includes(mat.numero) ? "" : "no-cursada"} 
                                ${aprobadas.includes(mat.numero) ? "aprobada" : ""}
                                ${checker(cursadas, mat.cursadas) ? "d-block" : "unavailable"}
                                ${checker(aprobadas, mat.aprobadas) ? "d-block" : "unavailable"}
                                `}
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
                                            disabled={!checker(cursadas, mat.cursadas)}
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
                                            disabled={!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas))}
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