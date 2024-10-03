import { useEffect, useState, useRef } from 'react';
import LeaderLine from 'leader-line-new';
import { CheckCircleFillIcon, XCircleFillIcon } from '@primer/octicons-react';

function Materias() {
    const [materias, setMaterias] = useState([])
    const [cursadas, setCursadas] = useState(JSON.parse(localStorage.getItem("cursadas")) || [])
    const [aprobadas, setAprobadas] = useState(JSON.parse(localStorage.getItem("aprobadas")) || [])
    const [cursando, setCursando] = useState(JSON.parse(localStorage.getItem("cursando")) || [])
    const [activeMaterias, setActiveMaterias] = useState([])
    const niveles = [1, 2, 3, 4, 5]
    const linesRef = useRef({})

    useEffect(() => {
        getMaterias()
    }, [])

    useEffect(() => {
        localStorage.setItem("cursadas", JSON.stringify(cursadas))
    }, [cursadas])

    useEffect(() => {
        localStorage.setItem("aprobadas", JSON.stringify(aprobadas))
    }, [aprobadas])

    useEffect(() => {
        localStorage.setItem("cursando", JSON.stringify(cursando))
    }, [cursando])

    const getMaterias = async () => {
        const response = await fetch("/carreras/sistemas.json")
        const fetchedMaterias = await response.json()
        setMaterias(fetchedMaterias)
    }

    useEffect(() => {
        let mats = document.getElementsByClassName("materia");
        const handleItemClick = (event) => {
            const item = event.currentTarget.parentElement.parentElement.parentElement
            if (item.dataset.open === "false") {
                item.classList.add("expanded")
                item.dataset.open = "true"
            } else {
                item.classList.remove("expanded")
                item.dataset.open = "false"
            }
        }
        for (let item of mats) {
            item = item.childNodes[1].childNodes[2].childNodes[1]
            item.addEventListener("click", handleItemClick)
        }
        return () => {
            for (let item of mats) {
                item.removeEventListener("click", handleItemClick)
            }
        }
    }, [materias])

    const uncheckDepend = (numero, tipo) => {
        if (tipo === "cursada") {
            for (let mat of materias) {
                if (mat.cursadas.includes(numero)) {
                    setAprobadas(prevAprobadas => prevAprobadas.filter(n => n !== mat.numero))
                    setCursadas(prevCursadas => {
                        const newCursadas = prevCursadas.filter(n => n !== mat.numero)
                        uncheckDepend(mat.numero, "cursada")
                        uncheckDepend(mat.numero, "aprobada")
                        return newCursadas
                    })
                }
            }
        } else if(tipo === "aprobada") {
            for (let mat of materias) {
                if (mat.aprobadas.includes(numero)) {
                    setCursadas(prevCursadas => prevCursadas.filter(n => n !== mat.numero))
                    setAprobadas(prevAprobadas => {
                        const newAprobadas = prevAprobadas.filter(n => n !== mat.numero)
                        uncheckDepend(mat.numero, "cursada")
                        uncheckDepend(mat.numero, "aprobada")
                        return newAprobadas
                    })
                }
            }
        }
    }

    const toggleCursadas = (numero) => {
        setCursadas(prevCursadas => {
            if (prevCursadas.includes(numero)) {
                setAprobadas(prevAprobadas => prevAprobadas.filter(n => n !== numero))
                uncheckDepend(numero, "cursada")
                uncheckDepend(numero, "aprobada")
                return prevCursadas.filter(n => n !== numero)
            } else {
                setCursando(prevCursando => prevCursando.filter(n => n !== numero))
                return [...prevCursadas, numero]
            }
        })
    }

    const toggleAprobadas = (numero) => {
        setAprobadas(prevAprobadas => {
            if (prevAprobadas.includes(numero)) {
                uncheckDepend(numero, "aprobada")
                return prevAprobadas.filter(n => n !== numero)
            } else {
                setCursadas(prevCursadas => [...prevCursadas, numero])
                setCursando(prevCursando => prevCursando.filter(n => n !== numero))
                return [...prevAprobadas, numero]
            }
        })
    }

    const toggleCursando = (numero) => {
        setCursando(prevCursando => {
            if(prevCursando.includes(numero)) {
                
                return prevCursando.filter(n => n !== numero)
            }else {
                setAprobadas(prevAprobadas => prevAprobadas.filter(n => n !== numero))
                setCursadas(prevCursadas => prevCursadas.filter(n => n !== numero))
                return [...prevCursando, numero]
            }
        })
    }

    const checker = (arr, target) => target.every(v => arr.includes(v))

    const getRandomInt = (min, max)=> {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    const toggleArrows = (numero, evt) => {
        const clickedMateria = document.getElementById(numero)
        const cursadasArrows = []
        const aprobadasArrows = []
        setActiveMaterias(prevActiveMaterias => [...prevActiveMaterias, clickedMateria])

        for (let mat of materias) {
            //Busca todas las materias correlativas de la materia clickeada
            if (mat.numero === numero) {
                for (let curs of mat.cursadas) {
                    const foundMateria = document.getElementById(curs)
                    cursadasArrows.push(foundMateria)
                    setActiveMaterias(prevActiveMaterias => [...prevActiveMaterias, foundMateria])
                }
                for (let aprob of mat.aprobadas) {
                    const foundMateria = document.getElementById(aprob)
                    aprobadasArrows.push(foundMateria)
                    setActiveMaterias(prevActiveMaterias => [...prevActiveMaterias, foundMateria])
                }
            }

            //Desactiva todos los otros botones de "Correlativa"
            if(evt.target.checked){
                const check = document.getElementById(`Flechas-${mat.numero}`)
                if(check.id != evt.target.id){
                    check.disabled = true
                }
            }else{
                const check = document.getElementById(`Flechas-${mat.numero}`)
                check.disabled = false
            }
        }

        if (evt.target.checked) {
            const newLines = []
            cursadasArrows.forEach(cursada => {
                var lineConfig = {}
                if(window.outerWidth > 425){
                    lineConfig = { color: '#7FFFD4', endPlug: 'arrow2', hide: true, dropShadow: true, outline: true, outlineColor: 'black', endPlugOutline: true}
                }else{
                    lineConfig = { color: '#7FFFD4', endPlug: 'arrow2', hide: true, dropShadow: true, outline: true, outlineColor: 'black', endPlugOutline: true, path: 'fluid', startSocket: 'left', endSocket: 'top' }
                }
                const line = new LeaderLine(cursada, clickedMateria, lineConfig)
                line.show('draw', { duration: 1000 })
                newLines.push(line)
            })

            aprobadasArrows.forEach(aprobada => {
                var lineConfig = {}
                if(window.outerWidth > 425){
                    lineConfig = { color: '#ADFF2F', endPlug: 'arrow2', hide: true, dropShadow: true, outline: true, outlineColor: 'black', endPlugOutline: true}
                }else{
                    lineConfig = { color: '#ADFF2F', endPlug: 'arrow2', hide: true, dropShadow: true, outline: true, outlineColor: 'black', endPlugOutline: true, path: 'fluid', startSocket: 'left', endSocket: 'top' }
                }
                const line = new LeaderLine(aprobada, clickedMateria, lineConfig)
                line.show('draw', { duration: 1000 })
                newLines.push(line)
            })

            linesRef.current[numero] = newLines;
        } else {
            setActiveMaterias([])
            if (linesRef.current[numero]) {
                linesRef.current[numero].forEach(line => {
                    line.hide('draw', { duration: 500 })
                    setTimeout(() => line.remove(), 500)
                });
                delete linesRef.current[numero]
            }
        }
    }

    return (
        <div className="materiasContainer">
            {niveles.map(nivel => (
                <div className='nivelBlock' key={nivel}>
                    <h2>{nivel}° AÑO</h2>
                    <hr/>
                    {materias.filter(mat => mat.nivel === nivel).map(mat => (
                        <div
                            key={mat.numero}
                            className={`materia ${cursadas.includes(mat.numero) ? "" : "no-cursada"} 
                            ${aprobadas.includes(mat.numero) ? "aprobada" : ""}
                            ${cursando.includes(mat.numero) ? "cursando" : ""}
                            ${checker(cursadas, mat.cursadas) ? "" : "unavailable"}
                            ${checker(aprobadas, mat.aprobadas) ? "" : "unavailable"}
                            ${activeMaterias.length > 0 && activeMaterias.includes(document.getElementById(mat.numero)) ? "scale" : ""}
                            ${activeMaterias.length > 0 && !activeMaterias.includes(document.getElementById(mat.numero)) ? "transparent" : ""}
                            ${activeMaterias.length > 0 && activeMaterias[0] === document.getElementById(mat.numero) ? "expanded" : ""}
                            `}
                            id={mat.numero}
                            data-open="false"
                        >
                            <div className='materiaTitle'>
                                <h2>{mat.nombre}</h2>
                            </div>
                            <div className='d-flex materiaBody'>
                                <div className='me-4'>
                                    <div>
                                        <label htmlFor={`Cursada-${mat.numero}`} className={`buttonCurs ${!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas)) ? 'disabledCheck' : ""}`}>
                                            <CheckCircleFillIcon size={12} className={`me-2 ${cursadas.includes(mat.numero) ? '' : 'd-none'}`} />
                                            <XCircleFillIcon size={12} className={`me-2 ${cursadas.includes(mat.numero) ? 'd-none' : ''}`} />
                                            Cursada
                                        </label>
                                        <input
                                        id={`Cursada-${mat.numero}`}
                                        className='hidden'
                                        name="Cursada"
                                        type='checkbox'
                                        onChange={() => toggleCursadas(mat.numero)}
                                        checked={cursadas.includes(mat.numero)}
                                        disabled={!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas))}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <label htmlFor={`Cursando-${mat.numero}`} className={`buttonCursando ${!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas)) ? 'disabledCheck' : ""}`}>
                                            <CheckCircleFillIcon size={12} className={`me-2 ${cursando.includes(mat.numero) ? '' : 'd-none'}`} />
                                            <XCircleFillIcon size={12} className={`me-2 ${cursando.includes(mat.numero) ? 'd-none' : ''}`} />
                                            Cursando
                                        </label>
                                        <input
                                        id={`Cursando-${mat.numero}`}
                                        className='hidden'
                                        name="Cursando"
                                        type='checkbox'
                                        onChange={() => toggleCursando(mat.numero)}
                                        checked={cursando.includes(mat.numero)}
                                        disabled={!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas))}
                                        />
                                    </div>
                                </div>

                                

                                <div className='me-4'>
                                    <label htmlFor={`Aprobada-${mat.numero}`} className={`buttonAprob ${!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas)) ? 'disabledCheck' : ""}`}>
                                        <CheckCircleFillIcon size={12} className={`me-2 ${aprobadas.includes(mat.numero) ? '' : 'd-none'}`} />
                                        <XCircleFillIcon size={12} className={`me-2 ${aprobadas.includes(mat.numero) ? 'd-none' : ''}`} />
                                        Aprobada
                                    </label>
                                    <input
                                    id={`Aprobada-${mat.numero}`}
                                    className='hidden'
                                    name="Aprobada"
                                    type='checkbox'
                                    onChange={() => toggleAprobadas(mat.numero)}
                                    checked={aprobadas.includes(mat.numero)}
                                    disabled={!(checker(cursadas, mat.cursadas) && checker(aprobadas, mat.aprobadas))}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`Flechas-${mat.numero}`} className='buttonCorrel'>
                                        Correlativas
                                    </label>
                                    <input
                                        id={`Flechas-${mat.numero}`}
                                        className='hidden'
                                        name="Flechas"
                                        type='checkbox'
                                        onChange={(evt) => toggleArrows(mat.numero, evt)}
                                    />
                                </div>
                            </div>
                            <div className='correlInfo'>
                                <div>
                                    <h3>Cursadas</h3>
                                    {mat.cursadas.length > 0 ? 
                                    mat.cursadas.map(cursadaNumero =>
                                        materias.filter(mate => mate.numero === cursadaNumero).map(mate => <h4 key={mate.numero}>{mate.nombre}</h4>)
                                    )
                                    : <h2>-</h2>}
                                </div>
                                <div>
                                    <h3>Aprobadas</h3>
                                    {mat.aprobadas.length > 0 ? 
                                    mat.aprobadas.map(aprobadaNumero =>
                                        materias.filter(mate => mate.numero === aprobadaNumero).map(mate => <h4 key={mate.numero}>{mate.nombre}</h4>)
                                    )
                                    : <h2>-</h2>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Materias;
