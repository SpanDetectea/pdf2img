import PdfViewer from "./components/PdfViewer/PdfViewer";
import SelectionPanel from "./components/SelectionPanel/SelectionPanel";
import "./App.css";
import { useState } from "react";
const App = () => {
  const [onError, setOnError] = useState(false);
  if (onError) {
    return (
      <div className="error">
        <p>Ошибка загрузки PDF файла, перепровертье правильность названия файла. Например (http://localhost:3000/?filename=example.pdf)</p>
      </div>
    );
  }
  return (
    <div className="app">
      <div className="app__pdfViewer">
        <PdfViewer setOnError={setOnError}/>
      </div>
      <div className="app__img">
        <SelectionPanel />
      </div>
    </div>
  );
};

export default App;
