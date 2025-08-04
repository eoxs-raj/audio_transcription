import React, { useState } from 'react';
import './App.css';
import { FiCopy } from 'react-icons/fi';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');
  const [transcript, setTranscript] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setStatus(`Selected: ${file.name}`);
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setStatus('Processing...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      setTranscript(data.transcript);
      setStatus('Done!');
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  const handleDownload = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setStatus('Copied to clipboard!');
      setTimeout(() => setStatus('Done!'), 1500);
    }
  };

  return (
    <div className="App">
      <header>
        <img src="/eoxs-erp.webp" alt="Eoxs Logo" className="logo-header" />
      </header>

      <div className="container">
        <h1>Transcribe Audio to Text</h1>
        <p>Upload your audio file and get the transcription instantly.</p>

        <div className="upload-card">
          <h2>Upload your file</h2>
          <p>Select an audio file from your system to get started.</p>
          <input
            type="file"
            id="fileInput"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button onClick={handleUploadClick}>Choose File</button>

          {selectedFile && (
            <div className="file-selected-msg">Selected: {selectedFile.name}</div>
          )}
        </div>

        <button onClick={handleTranscribe}>Transcribe</button>
        <button onClick={handleDownload} disabled={!transcript}>
          Download Output
        </button>

        {status && !status.startsWith('Selected:') && (
          <div id="status">{status}</div>
        )}

        {transcript && (
          <div className="transcript-box">
            <div className="transcript-header">
              <h2>Transcript</h2>
              <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
                <FiCopy size={18} />
              </button>
            </div>
            <pre>{transcript}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
