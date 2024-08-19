import axios from 'axios';
import React, { useCallback } from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';

const States = {
    "INPUT": "input",
    "OUTPUT": "output"
}

const CodeRun = ({codeRef}) => {
    const [currentState, setCurrentState] = useState(States.INPUT);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("5");

    
    const runCode = () => {
        toast.success("Running Code");
        var options = {
          method: "POST",
          url: "https://code-compiler.p.rapidapi.com/v2",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "x-rapidapi-host": "code-compiler.p.rapidapi.com",
            "x-rapidapi-key":
              "0ca192bd34mshca25146e7ea1142p17a87ajsn20830dca802b",
          },
          data: {
            LanguageChoice: language,
            Program: codeRef.current,
            Input: input
          },
        };

        axios
          .request(options)
          .then(function (response) {
              if (response.data.Errors) {
                  setOutput(response.data.Errors);
                  toast.error("Code failed !");
              }
              else {
                  setOutput(response.data.Result);
                  toast.success("Code executed successfully !");
              }
              setCurrentState(States.OUTPUT)
              
          })
          .catch(function (error) {
              console.error(error);
              setOutput(error);
              setCurrentState(States.OUTPUT);
              toast.error("Code failed !");
          });
    }

  return (
    <div className="flex flex-col h-full px-4">
      <div className="flex items-center justify-between py-3 px-4 border border-white rounded-lg shadow-inner mb-2">
        <div className='flex gap-5'>
          <button
            className={`${
              currentState === States.INPUT ? "opacity-100" : "opacity-80"
            } bg-white text-black p-[5px] text-[15px] cursor-pointer w-[100px] h-[40px] rounded-md`}
            onClick={() => setCurrentState(States.INPUT)}
          >
            Input
          </button>
          <button
            className={`${
              currentState === States.OUTPUT ? "opacity-100" : "opacity-80"
            } bg-white text-black p-[5px] text-[15px] cursor-pointer w-[100px] h-[40px] rounded-md`}
            onClick={() => setCurrentState(States.OUTPUT)}
          >
            Output
          </button>
        </div>
        <div className='flex gap-5'>
          <select
            className="p-[5px] text-[15px] cursor-pointer mr-[10px] text-black rounded-md"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="5">Python</option>
            <option value="7">C++</option>
            <option value="4">Java</option>
            <option value="17">JavaScript</option>
          </select>
          <button
            className="bg-[#38E078] text-black p-[5px] text-[15px] cursor-pointer w-[100px] h-[40px] rounded-md"
            ref={codeRef}
            onClick={runCode}
          >
            Run
          </button>
        </div>
      </div>


      <textarea
        className="h-[100%] bg-[#2f2f3d] border border-gray-500 text-[16px] p-[10px] border-white rounded-lg shadow-inner text-white mt-1 resize-none"
        placeholder="Enter your input here..."
        readOnly={currentState === States.OUTPUT}
        value={currentState === States.INPUT ? input : output}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
    </div>

  );
}

export default CodeRun;