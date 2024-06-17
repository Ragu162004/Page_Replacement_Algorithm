import React, { useState } from "react";
import "./App.css";

function App() {
  const [sequence, setSequence] = useState("");
  const [frameSize, setFrameSize] = useState(0);
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [output, setOutput] = useState([]);

  const runAlgorithm = () => {
    switch (algorithm) {
      case "FIFO":
        runFIFO();
        break;
      case "LRU":
        runLRU();
        break;
      case "OPT":
        runOPT();
        break;
      default:
        break;
    }


    if(sequence.length > 0 && frameSize >0) {
      const action = document.getElementById("output-container")
      action.style.display = 'block';
    }
  };

  const runFIFO = () => {
    const seqArray = sequence.split(",").map((num) => parseInt(num.trim()));
    const frame = Array(parseInt(frameSize)).fill(-1);
    let pageFaults = 0;
    let pattern = "";
    let index = 0;
    let findex = 0;
    const result = [];

    result.push(`Initial Frame: ${frame.join(" ")}`);

    while (index < seqArray.length) {
      const page = seqArray[index];
      if (!frame.includes(page)) {
        pageFaults++;
        frame[findex] = page;
        pattern += "Y ";
        findex = (findex + 1) % frame.length;
        result.push(`Frame after inserting ${page}: ${frame.join(" ")}`);
      } else {
        pattern += "N ";
        result.push(
          `Frame after checking ${page} (no change): ${frame.join(" ")}`
        );
      }
      index++;
    }

    result.push(`Final Frame: ${frame.join(" ")}`);
    result.push(`No of page faults = ${pageFaults}`);
    result.push(`Pattern: ${pattern}`);

    setOutput(result);
  };

  const runLRU = () => {
    const seqArray = sequence.split(",").map((num) => parseInt(num.trim()));
    const frame = [];
    const pageOrder = [];
    let pageFaults = 0;
    const result = [];

    result.push(`Initial Frame: ${frame.join(" ")}`);

    seqArray.forEach((page) => {
      if (!frame.includes(page)) {
        if (frame.length < frameSize) {
          frame.push(page);
        } else {
          const lruPage = pageOrder.shift();
          const indexToReplace = frame.indexOf(lruPage);
          frame[indexToReplace] = page;
        }
        pageFaults++;
        result.push(`Frame after inserting ${page}: ${frame.join(" ")}`);
      } else {
        result.push(
          `Frame after checking ${page} (no change): ${frame.join(" ")}`
        );
      }
      pageOrder.push(page);
      pageOrder.splice(pageOrder.lastIndexOf(page), 1);
      pageOrder.push(page);
    });

    result.push(`Final Frame: ${frame.join(" ")}`);
    result.push(`No of page faults = ${pageFaults}`);

    setOutput(result);
  };

  const runOPT = () => {
    const seqArray = sequence.split(",").map((num) => parseInt(num.trim()));
    const frame = [];
    let pageFaults = 0;
    const result = [];

    result.push(`Initial Frame: ${frame.join(" ")}`);

    for (let i = 0; i < seqArray.length; i++) {
      const page = seqArray[i];
      if (!frame.includes(page)) {
        if (frame.length < frameSize) {
          frame.push(page);
        } else {
          let farthestIndex = -1;
          let farthestPage = -1;
          for (let j = 0; j < frame.length; j++) {
            const nextIndex = seqArray.slice(i + 1).indexOf(frame[j]);
            if (nextIndex === -1) {
              farthestIndex = j;
              break;
            }
            if (nextIndex > farthestIndex) {
              farthestIndex = nextIndex;
              farthestPage = frame[j];
            }
          }
          const replaceIndex =
            farthestIndex !== -1
              ? frame.indexOf(farthestPage)
              : frame.length - 1;
          frame[replaceIndex] = page;
        }
        pageFaults++;
        result.push(`Frame after inserting ${page}: ${frame.join(" ")}`);
      } else {
        result.push(
          `Frame after checking ${page} (no change): ${frame.join(" ")}`
        );
      }
    }

    result.push(`Final Frame: ${frame.join(" ")}`);
    result.push(`No of page faults = ${pageFaults}`);

    setOutput(result);
  };

  return (
    <div className="mainContainer">
    <div className="container">
      <h1>Page Replacement Algorithms</h1>
      <div className="input-container">
        <label>Enter the sequence of pages (comma-separated): </label>
        <input
          type="text"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Enter the number of frames: </label>
        <input
          type="number"
          value={frameSize}
          onChange={(e) => setFrameSize(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Select the algorithm: </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="FIFO">FIFO</option>
          <option value="LRU">LRU</option>
          <option value="OPT">OPT</option>
        </select>
      </div>
      <button onClick={runAlgorithm}>Run</button>
    </div>
      <div id="output-container">
        <h1>{algorithm}</h1>
        {output.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      </div>
  );
}

export default App;
