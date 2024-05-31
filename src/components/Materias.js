import { useEffect, useState } from 'react'
import useHorizontalScroll from '@revolt-digital/use-horizontal-scroll'
import { Accordion } from 'react-bootstrap'

function Materias(){
    const [materias, setMaterias] = useState([])
    const [cursadas, setCursadas] = useState(JSON.parse(localStorage.getItem("cursadas")) || [])
    const [aprobadas, setAprobadas] = useState(JSON.parse(localStorage.getItem("aprobadas")) || [])
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

    useEffect(() => {
        let mats = document.getElementsByClassName("materia");
        const handleItemClick = (event) => {
            const item = event.currentTarget
            if (item.dataset.open === "false") {
                item.classList.add("expanded")
                item.dataset.open = "true"
                // setTimeout(() => {
                //     window.scrollTo(window.pageXOffset, document.body.scrollHeight)
                // }, 300);
            } else {
                item.classList.remove("expanded")
                item.dataset.open = "false"
            }
        }
        for (let item of mats) {
            item.addEventListener("click", handleItemClick)
        }
        return () => {
            for (let item of mats) {
                item.removeEventListener("click", handleItemClick)
            }
        }
    }, [materias])

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
                uncheckDepend(numero, "aprobada")
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
                            data-open="false"
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
                                        disabled={!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas))}
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
                            <div className='mt-2'>
                                <div>
                                    <h3>Cursadas</h3>
                                    {mat.cursadas.length > 0 ? 
                                    mat.cursadas.map(cursadaNumero =>
                                        materias.filter(mate => mate.numero === cursadaNumero).map(mate => <h4 key={mate.numero}>{mate.nombre}</h4>)
                                    )
                                    : <h3>-</h3>}
                                </div>
                                <div>
                                    <h3>Aprobadas</h3>
                                    {mat.aprobadas.length > 0 ? 
                                    mat.aprobadas.map(aprobadaNumero =>
                                        materias.filter(mate => mate.numero === aprobadaNumero).map(mate => <h4 key={mate.numero}>{mate.nombre}</h4>)
                                    )
                                    : <h3>-</h3>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Materias