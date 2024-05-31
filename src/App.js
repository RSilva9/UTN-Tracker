import CareerButtons from "./components/CareerButtons.js";
import Materias from "./components/Materias.js";

function App() {
  return (
    <div className="App">
      <div className="d-flex mb-3">
        <h1>UTN TRACKER - SEGUIDOR DE CARRERA</h1>
        <button onClick={()=> {
          localStorage.clear()
          window.location.reload()
        }} className="ms-3">Reiniciar progreso</button>
      </div>
      <CareerButtons/>
      <Materias />
    </div>
  );
}

export default App;
