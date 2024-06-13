import { AwesomeButton } from "react-awesome-button";
import CareerButtons from "./components/CareerButtons.js";
import Materias from "./components/Materias.js";
import ResetButton from "./components/ResetButton.js";

function App() {
  return (
    <div className="App">
      <div className="d-flex mb-3">
        <img src="/img/utnTracker.webp" className="m-auto"></img>
      </div>
      <CareerButtons />
      <ResetButton />
      <Materias />
    </div>
  );
}

export default App;
