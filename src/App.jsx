import React, { useEffect, useState } from "react";
import "../src/App.css";
import machine from "../src/assets/keyboard.png";

function App() {
  const [textFiles, setTextFiles] = useState([]);
  const [wordCountResults, setWordCountResults] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [searchWordResults, setSearchWordCountResults] = useState([]);
 

  

  

  const onLoad = (e) => {
    let fileInput = e.target;
    let file = fileInput.files[0];
    let fileName = file.name;
    let textType = /text.*/;

    if (file.type.match(textType)) {
      let reader = new FileReader();
      reader.onload = function (event) {
        let content = new Blob([reader.result], { type: file.type });
        setTextFiles([...textFiles, { name: fileName, content }]);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("El archivo seleccionado no es de tipo texto.");
    }
  };

  const countWords = async () => {
    if (textFiles.length === 0) {
      alert("No se han subido archivos para contar palabras.");
      return;
    }
    const formData = new FormData();

    textFiles.forEach((file, index) => {
      formData.append(`file${index}`, file.content, file.name);
    });
    
    try {
      const response = await fetch(
        "http://localhost:4000/api/file/count-words",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWordCountResults(data);
      }
    } catch (error) {
      console.error("Error al contar palabras:", error);
    }
  };

  const findWord = async (searchWord) => {
    if (textFiles.length === 0) {
      alert("No se han subido archivos para buscar palabras.");
      return;
    }
    const formData2 = new FormData();

    textFiles.forEach((file, index) => {
      formData2.append(`file${index}`, file.content, file.name);
    });
    if (!searchWord) {
      alert("Por favor, ingrese una palabra o letra para buscar.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/file/find-word?word=${searchWord}`,
        {
          method: "POST",
          body: formData2,
        }
      );

      if (response.ok) {
      
        const data = await response.json();
        
        setSearchWordCountResults(data);

      
      } else {
        console.error("Error al buscar la palabra:", response.status);
        
      }
    } catch (error) {
      console.error("Error al buscar la palabra:", error);
    }
  };

  const handleSearch = () => {
    findWord(searchWord);
  };
  return (
    <div>
      <div
        id="main-container"
        className="flex items-center justify-center h-screen w-screen bg-slate-200"
      >
        <div id="app-card" className="flex bg-white w-3/4 h-3/4 shadow-2xl">
          <div
            id="left-container"
            className="flex-1  text-center "
          >
            <div id="left-subcontainer" className="flex h-full w-full p-4">
              <div id="functionalities" className="flex flex-col h-full w-full">
                <div
                  id="l-1"
                  className="flex flex-1 bg-white items-center justify-center  "
                >
                  <div className="flex flex-1 items-center justify-center">
                    <img
                      className="h-1/3 w-1/3"
                      src={machine}
                      alt="Text Manager"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <label
                      htmlFor="fileInput"
                      className="block h-2/3 w-2/3 rounded-md bg-gray-700 py-2 px-4 text-white cursor-pointer hover:bg-gray-500 relative group"
                    >
                      Sube tu archivo txt
                    </label>

                    <input
                      className="hidden"
                      accept=".txt"
                      type="file"
                      id="fileInput"
                      onChange={onLoad}
                      multiple
                    ></input>
                  </div>
                </div>
                <div
                  id="l-2"
                  className="flex flex-1 flex-col bg-white  items-center justify-center  "
                >
                  Archivos subidos: <br />
                  {textFiles.map((fileObject, index) => (
                    <div key={index}>{fileObject.name}</div>
                  ))}
                </div>
                <div
                  id="l-3"
                  className="flex flex-1  items-center justify-center   "
                >
                  <button className="block h-1/4 w-1/4 rounded-md bg-blue-700 py-2 px-4 text-white cursor-pointer hover:bg-gray-500 relative group" onClick={countWords}>Contar</button>
                </div>
                <div id="l-4" className="flex flex-1  ">
                  <div id="search-container" className="flex h-full w-full ">
                    <div
                      id="search-input"
                      className="flex  flex-1  text-center items-center justify-center"
                    > 
                      <input
                      className=" border "
                        type="text"
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        placeholder="Ingrese la palabra o letra a buscar"
                      />
                    </div>
                    <div
                      id="search-button"
                      className="flex flex-1   text-center items-center justify-center"
                    >
                      <button className="block h-1/4 w-1/2 rounded-md bg-red-700 py-2 px-4 text-white cursor-pointer hover:bg-gray-500 relative group" onClick={handleSearch}>Buscar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="right-container"
            className="flex-1  text-center "
          >
            <div id="left-subcontainer" className="h-full w-full p-4 ">
              <div id="results" className="flex flex-col h-full w-full bg-gray-700 text-white">
                <div
                  id="r-1"
                  className="flex flex-1 justify-center items-center  "
                >
                  Resultados
                </div>
                <div
                  id="r-2"
                  className="flex flex-1 justify-center items-center  bg-blue-700 text-white"
                >
                  <div
                    id="sr-2"
                    className="flex flex-1 flex-col justify-center items-center "
                  >
                    <h2>Cantidad de palabras por archivo:</h2>
                    {wordCountResults.data &&
                    wordCountResults.data.length > 0  ? (
                      <ul>
                        {wordCountResults.data.map((result, index) => (
                          
                          <li key={index}>
                            Palabras dentro del archivo {" "}{result.file} {": "}
                            {result.counter} 
                          </li>
                          
                        ))}
                      </ul>
                    ) : (
                      <p></p>
                    )}
                    
                  </div>
                  <br/>
                </div>
                <div
                  id="r-3"
                  className="flex flex-1 justify-center items-center  bg-red-700 text-white"
                >
                  <div
                    id="r-2"
                    className="flex flex-1 justify-center items-center "
                  >
                    <div
                      id="r-2"
                      className="flex flex-1 flex-col justify-center items-center "
                    >
                      <h2>Coincidencias encontradas por archivo:</h2>
                      {searchWordResults.data &&
                      searchWordResults.data.length > 0 ? (
                        <div >
                          {searchWordResults.data.map((result, index) => (
                            <div key={index}>
                              La palabra o letra {" "}"{result.word}"{" "} se repite {" "}
                               {result.counter} {" veces"} en el archivo {" "} {result.file}

                            </div>
                            
                          ))}
                        </div>
                      ) : (
                        <p>
                          
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
