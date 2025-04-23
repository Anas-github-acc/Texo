'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

export default function Playground() {
  const [files, setFiles] = useState([
    { name: 'index.html', language: 'html', content: '<h1>Hello World</h1>' },
    { name: 'style.css', language: 'css', content: 'body { background: white; }' },
    { name: 'app.js', language: 'javascript', content: 'console.log("Hello!");' },
  ]);

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    const currentFile = files[currentFileIndex];
    try {
      if (currentFile.language === 'javascript') {
        const result = eval(currentFile.content);
        setOutput(String(result));
      } else if (currentFile.language === 'html') {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(currentFile.content);
          newWindow.document.close();
        }
      } else if (currentFile.language === 'css') {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`<html><head><style>${currentFile.content}</style></head><body></body></html>`);
          newWindow.document.close();
        }
      } else {
        setOutput('Execution for this language is not supported.');
      }
    } catch (error: unknown) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 animate-fade-up">Mini Playground 🚀</h1>

      <div className="w-full max-w-7xl flex gap-6">
        {/* Left Side - Editor */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Tabs for files */}
          <div className="flex gap-2 mb-4">
            {files.map((file, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-lg ${currentFileIndex === idx ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setCurrentFileIndex(idx)}
              >
                {file.name}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <Select
            onValueChange={(val) => {
              const newFiles = [...files];
              newFiles[currentFileIndex].language = val;
              setFiles(newFiles);
            }}
            value={files[currentFileIndex].language}
          >
            <SelectTrigger className="w-48">
              {files[currentFileIndex].language.toUpperCase()}
            </SelectTrigger>
            <SelectContent>
              {['html', 'css', 'javascript'].map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Editor */}
          <div className="border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <Editor
              height="500px"
              language={files[currentFileIndex].language}
              value={files[currentFileIndex].content}
              onChange={(value) => {
                const newFiles = [...files];
                newFiles[currentFileIndex].content = value || '';
                setFiles(newFiles);
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontLigatures: true,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            className="mt-4 bg-green-500 hover:bg-green-600 transition-colors px-6 py-2 rounded-full font-semibold shadow-md"
          >
            Run Code
          </button>
        </div>

        {/* Right Side - Output */}
        <div className="flex-1 bg-gray-100 text-black p-6 rounded-2xl border border-gray-300 shadow-inner">
          <h2 className="text-2xl font-semibold mb-4">Output:</h2>
          <div className="bg-white rounded-lg p-4 shadow overflow-x-auto h-[500px]">
            <pre className="whitespace-pre-wrap break-words">{output ?? 'No output yet.'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
