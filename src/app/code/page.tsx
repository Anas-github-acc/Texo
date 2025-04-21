"use client"
import { useState, useEffect, useRef } from "react"
import { Play, Loader2, Code, Terminal, RefreshCw, Copy, Check, Trash, Info, ExternalLink, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [showTips, setShowTips] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [history, setHistory] = useState<{ code: string; output: string; timestamp: number }[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to run code
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        handleRun()
      }

      // Ctrl+L to clear output
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault()
        setOutput("")
      }

      // Ctrl+S to save to history
      if (e.ctrlKey && e.key === "s" && code.trim()) {
        e.preventDefault()
        saveToHistory()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [code, loading])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = "auto"
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`
    }
  }, [code])

  // Scroll to bottom of output when it changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleRun = async () => {
    if (!code.trim() || loading) return

    setLoading(true)
    setExecutionTime(null)
    const startTime = performance.now()

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: code,
      })

      const text = await res.text()
      setOutput(text)

      // Calculate execution time
      const endTime = performance.now()
      setExecutionTime(endTime - startTime)

      // Save to history
      saveToHistory(text)

      // Scroll to output on mobile
      if (window.innerWidth < 768) {
        document.getElementById("output-section")?.scrollIntoView({ behavior: "smooth" })
      }
    } catch (err) {
      setOutput("❌ Failed to reach interpreter server.")
    } finally {
      setLoading(false)
    }
  }

  const saveToHistory = (outputText = output) => {
    if (!code.trim()) return

    setHistory((prev) =>
      [
        ...prev,
        {
          code,
          output: outputText,
          timestamp: Date.now(),
        },
      ].slice(-10),
    ) // Keep only last 10 entries
  }

  const loadFromHistory = (index: number) => {
    if (history[index]) {
      setCode(history[index].code)
      setOutput(history[index].output)
      setShowHistory(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  // Sample code for new users
  const sampleCode = `// Recursive function that subtracts 1 from n until it reaches 0
fun subtract(n) {
    if (n == 0) {
        return;
    }
    write(n);
    subtract(n - 1);  // Recursive call with n - 1
}

// Start the recursion with 5
var num = 5;
subtract(num);`

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <main
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#0a0c1b] text-white" : "bg-gray-50 text-gray-900"
      } py-12 px-4 sm:px-6 flex flex-col items-center transition-all duration-500 overflow-x-hidden`}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className={`absolute top-[-50%] right-[-10%] w-[70%] h-[70%] ${
            theme === "dark" ? "bg-[#4f46e5]/10" : "bg-[#4f46e5]/5"
          } rounded-full blur-[120px] transition-all duration-700`}
        ></div>
        <div
          className={`absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] ${
            theme === "dark" ? "bg-[#06b6d4]/10" : "bg-[#06b6d4]/5"
          } rounded-full blur-[120px] transition-all duration-700`}
        ></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3"
          >
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-violet-600 via-cyan-500 to-blue-600 blur-xl ${
                  theme === "dark" ? "opacity-30" : "opacity-20"
                } rounded-full transition-opacity duration-500`}
              ></div>
              <div
                className={`relative ${
                  theme === "dark"
                    ? "bg-[#0f1129] border-indigo-500/20 text-indigo-300"
                    : "bg-white/80 border-indigo-200 text-indigo-600"
                } border rounded-full px-5 py-1.5 text-xs font-medium transition-colors duration-500`}
              >
                Interactive Code Playground
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-5xl sm:text-6xl font-bold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-500"
                : "bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-700"
            } mb-4 tracking-tight transition-all duration-500`}
          >
            Aoi Interpreter
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto text-sm sm:text-base transition-colors duration-500`}
          >
            Write, execute, and visualize Aoi code in this beautiful interactive environment
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 flex justify-center gap-2"
          >
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                  : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              }`}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={() => setShowTips(!showTips)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                  : "bg-cyan-100 hover:bg-cyan-200 text-cyan-700"
              }`}
            >
              <Info className="w-3 h-3" />
              {showTips ? "Hide Tips" : "Show Tips"}
            </button>
          </motion.div>
        </div>

        {/* Tips Section */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div
                className={`w-full p-4 rounded-xl border ${
                  theme === "dark" ? "bg-[#0f1129]/80 border-indigo-500/20" : "bg-white/80 border-indigo-200/50"
                } shadow-lg transition-colors duration-500`}
              >
                <h3
                  className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}
                >
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-2 p-2 rounded ${
                      theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-50"
                    }`}
                  >
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      Enter
                    </kbd>
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Run code</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-2 rounded ${
                      theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-50"
                    }`}
                  >
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      L
                    </kbd>
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Clear output</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-2 rounded ${
                      theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-50"
                    }`}
                  >
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd
                      className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        theme === "dark"
                          ? "bg-[#0a0c1b] border-indigo-500/20 text-indigo-300"
                          : "bg-white border-indigo-200 text-indigo-700"
                      } border`}
                    >
                      S
                    </kbd>
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Save to history</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* Left: Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2 group">
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg ${
                    theme === "dark" ? "shadow-indigo-900/30" : "shadow-indigo-500/20"
                  }`}
                >
                  <Code className="h-3.5 w-3.5 text-white" />
                </div>
                <span
                  className={`bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-200 to-indigo-100 group-hover:from-indigo-100 group-hover:to-white"
                      : "bg-gradient-to-r from-indigo-700 to-indigo-600 group-hover:from-indigo-800 group-hover:to-indigo-700"
                  } transition-all duration-300`}
                >
                  Code Editor
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                  }`}
                  disabled={!code.trim()}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => setCode(sampleCode)}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Sample
                </button>
                <button
                  onClick={() => setCode("")}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                  }`}
                >
                  <Trash className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            <div
              className={`relative w-full flex-1 flex ${
                theme === "dark" ? "bg-[#0f1129] border-indigo-500/20" : "bg-white border-indigo-200/50"
              } border rounded-xl overflow-hidden text-sm font-mono shadow-xl ${
                theme === "dark" ? "shadow-indigo-950/20" : "shadow-indigo-200/30"
              } group transition-colors duration-500`}
            >
              {/* Editor chrome */}
              <div
                className={`absolute top-0 left-0 right-0 h-8 ${
                  theme === "dark" ? "bg-[#0a0c1b]/80 border-indigo-500/10" : "bg-gray-50/80 border-indigo-100"
                } border-b flex items-center px-4 transition-colors duration-500`}
              >
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>

                <div className="absolute right-4 flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`text-xs flex items-center gap-1 px-1.5 py-0.5 rounded ${
                      theme === "dark"
                        ? "hover:bg-indigo-500/20 text-indigo-400"
                        : "hover:bg-indigo-100 text-indigo-600"
                    } transition-colors duration-200`}
                  >
                    History
                  </button>
                </div>
              </div>

              {/* Line Numbers */}
              <div
                className={`${
                  theme === "dark"
                    ? "bg-[#080a16] text-gray-600 border-indigo-500/10"
                    : "bg-gray-50 text-gray-400 border-indigo-100"
                } px-3 pt-10 pb-4 text-right select-none w-12 border-r transition-colors duration-500`}
              >
                {Array.from({ length: Math.max((code.match(/\n/g) || []).length + 1, 1) }).map((_, i) => (
                  <div key={i} className="h-5 leading-5 text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={editorRef}
                className={`flex-1 pt-10 px-4 pb-4 bg-transparent ${
                  theme === "dark" ? "text-indigo-100" : "text-indigo-950"
                } focus:outline-none resize-none min-h-[400px] transition-colors duration-500 placeholder:${
                  theme === "dark" ? "text-indigo-800/50" : "text-indigo-300"
                }`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your Aoi code here..."
                spellCheck="false"
              />

              {/* Glow effect on focus */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-focus-within:${
                  theme === "dark" ? "opacity-20" : "opacity-10"
                } transition-opacity duration-300 -z-10`}
              ></div>

              {/* History dropdown */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-8 right-0 w-64 max-h-80 overflow-y-auto z-50 ${
                      theme === "dark"
                        ? "bg-[#0f1129] border-indigo-500/20 text-indigo-100"
                        : "bg-white border-indigo-200 text-indigo-950"
                    } border rounded-b-lg shadow-xl`}
                  >
                    <div className="p-2 text-xs font-medium border-b border-indigo-500/10">Code History</div>
                    {history.length === 0 ? (
                      <div className="p-4 text-xs text-center text-gray-500">No history yet</div>
                    ) : (
                      <div className="divide-y divide-indigo-500/10">
                        {history.map((entry, index) => (
                          <div
                            key={index}
                            onClick={() => loadFromHistory(index)}
                            className={`p-2 text-xs cursor-pointer hover:${
                              theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-50"
                            }`}
                          >
                            <div className="font-medium truncate">{entry.code.split("\n")[0]}</div>
                            <div className="text-gray-500 text-[10px]">{formatTime(entry.timestamp)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRun}
                disabled={loading || !code.trim()}
                className={`px-6 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                  loading || !code.trim()
                    ? theme === "dark"
                      ? "bg-indigo-800/30 text-indigo-300/50 cursor-not-allowed"
                      : "bg-indigo-300 text-white cursor-not-allowed"
                    : theme === "dark"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/40 hover:-translate-y-0.5"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Code
                  </>
                )}
              </button>

              <div className={`text-xs ${theme === "dark" ? "text-indigo-300/50" : "text-indigo-500/70"}`}>
                Press{" "}
                <kbd
                  className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                    theme === "dark"
                      ? "bg-[#0f1129] border-indigo-500/20 text-indigo-300"
                      : "bg-white border-indigo-200 text-indigo-700"
                  } border`}
                >
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd
                  className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                    theme === "dark"
                      ? "bg-[#0f1129] border-indigo-500/20 text-indigo-300"
                      : "bg-white border-indigo-200 text-indigo-700"
                  } border`}
                >
                  Enter
                </kbd>{" "}
                to run
              </div>
            </div>
          </motion.div>

          {/* Right: Output Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            id="output-section"
            className="flex-1 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2 group">
                <div
                  className={`flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-lg ${
                    theme === "dark" ? "shadow-cyan-900/30" : "shadow-cyan-500/20"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-white" />
                </div>
                <span
                  className={`bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-200 to-cyan-100 group-hover:from-cyan-100 group-hover:to-white"
                      : "bg-gradient-to-r from-cyan-700 to-cyan-600 group-hover:from-cyan-800 group-hover:to-cyan-700"
                  } transition-all duration-300`}
                >
                  Output Console
                </span>
              </label>

              <div className="flex items-center gap-2">
                {executionTime !== null && (
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      theme === "dark" ? "text-cyan-400" : "text-cyan-700"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {executionTime.toFixed(0)}ms
                  </div>
                )}
                <button
                  onClick={() => setOutput("")}
                  disabled={!output}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                    output
                      ? theme === "dark"
                        ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                        : "bg-cyan-100 hover:bg-cyan-200 text-cyan-700"
                      : theme === "dark"
                        ? "bg-cyan-500/5 text-cyan-300/30 cursor-not-allowed"
                        : "bg-cyan-100/50 text-cyan-700/30 cursor-not-allowed"
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>

            <div
              className={`w-full h-[400px] ${
                theme === "dark" ? "bg-[#0f1129] border-cyan-500/20" : "bg-white border-cyan-200/50"
              } border rounded-xl overflow-hidden shadow-xl ${
                theme === "dark" ? "shadow-cyan-950/20" : "shadow-cyan-200/30"
              } group relative transition-colors duration-500`}
            >
              {/* Terminal chrome */}
              <div
                className={`absolute top-0 left-0 right-0 h-8 ${
                  theme === "dark" ? "bg-[#0a0c1b]/80 border-cyan-500/10" : "bg-gray-50/80 border-cyan-100"
                } border-b flex items-center px-4 transition-colors duration-500`}
              >
                <div className={`text-xs ${theme === "dark" ? "text-cyan-500/50" : "text-cyan-700/50"} font-mono`}>
                  aoi@terminal:~$
                </div>
              </div>

              <div
                ref={outputRef}
                className="w-full h-full pt-10 px-5 pb-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
              >
                {output ? (
                  <div className={`${theme === "dark" ? "text-cyan-100" : "text-cyan-900"} animate-fade-in`}>
                    {output}
                  </div>
                ) : (
                  <div
                    className={`${
                      theme === "dark" ? "text-cyan-700" : "text-cyan-500/70"
                    } h-full flex items-center justify-center`}
                  >
                    <div className="text-center">
                      <div className="mb-3 opacity-50">
                        <Terminal className="w-8 h-8 mx-auto" />
                      </div>
                      <div>Run your code to see output here</div>
                      <div className="mt-2 text-xs opacity-70">Output will appear in this console</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Glow effect on active */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-600 rounded-xl transition-opacity duration-300 -z-10 ${
                  output ? (theme === "dark" ? "opacity-20" : "opacity-10") : "opacity-0"
                }`}
              ></div>
            </div>
          </motion.div>
        </div>

        {/* Key Points Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-full mt-12 ${
            theme === "dark" ? "bg-[#0f1129]/80 border-indigo-500/20" : "bg-white/90 border-indigo-200/50"
          } p-8 rounded-xl border shadow-xl relative overflow-hidden group transition-colors duration-500`}
        >
          {/* Background glow */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-xl ${
              theme === "dark" ? "opacity-50" : "opacity-30"
            } group-hover:opacity-70 transition-opacity duration-700`}
          ></div>

          <h2
            className={`text-lg font-semibold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-300 to-cyan-300"
                : "bg-gradient-to-r from-indigo-700 to-cyan-700"
            } mb-6 flex items-center gap-3 relative`}
          >
            <span className="inline-block w-1 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full"></span>
            Important Notes
          </h2>

          <ul className="space-y-4 text-sm relative">
            <li className="flex items-start gap-3 group/item">
              <span
                className={`inline-flex items-center justify-center bg-gradient-to-br ${
                  theme === "dark"
                    ? "from-indigo-600 to-indigo-800 shadow-indigo-900/30 group-hover/item:from-indigo-500 group-hover/item:to-indigo-700"
                    : "from-indigo-500 to-indigo-700 shadow-indigo-500/20 group-hover/item:from-indigo-400 group-hover/item:to-indigo-600"
                } text-xs rounded-full h-6 w-6 mt-0.5 text-white shadow-md transition-all duration-300`}
              >
                1
              </span>
              <span
                className={`${
                  theme === "dark"
                    ? "text-indigo-100 group-hover/item:text-white"
                    : "text-indigo-950 group-hover/item:text-indigo-800"
                } transition-colors duration-300`}
              >
                Do not use numbers greater than 145 while using recursion to avoid stack overflow issues.
              </span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span
                className={`inline-flex items-center justify-center bg-gradient-to-br ${
                  theme === "dark"
                    ? "from-indigo-800 to-cyan-800 shadow-indigo-900/30 group-hover/item:from-indigo-500 group-hover/item:to-indigo-700"
                    : "from-indigo-600 to-cyan-700 shadow-indigo-500/20 group-hover/item:from-indigo-500 group-hover/item:to-cyan-600"
                } text-xs rounded-full h-6 w-6 mt-0.5 text-white shadow-md transition-all duration-300`}
              >
                2
              </span>
              <span
                className={`${
                  theme === "dark"
                    ? "text-indigo-100 group-hover/item:text-white"
                    : "text-indigo-950 group-hover/item:text-indigo-800"
                } transition-colors duration-300`}
              >
                The scan function is currently broken and should not be used in your code.
              </span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span
                className={`inline-flex items-center justify-center bg-gradient-to-br ${
                  theme === "dark"
                    ? "from-cyan-600 to-cyan-800 shadow-cyan-900/30 group-hover/item:from-cyan-500 group-hover/item:to-cyan-700"
                    : "from-cyan-500 to-cyan-700 shadow-cyan-500/20 group-hover/item:from-cyan-400 group-hover/item:to-cyan-600"
                } text-xs rounded-full h-6 w-6 mt-0.5 text-white shadow-md transition-all duration-300`}
              >
                3
              </span>
              <span
                className={`${
                  theme === "dark"
                    ? "text-indigo-100 group-hover/item:text-white"
                    : "text-indigo-950 group-hover/item:text-indigo-800"
                } transition-colors duration-300`}
              >
                For complete syntax documentation, refer to{" "}
                <a
                  href="https://github.com/AadiS27/Interpreter/blob/main/src/syntax.md"
                  className={`${
                    theme === "dark"
                      ? "text-cyan-400 hover:text-cyan-300 decoration-cyan-700 hover:decoration-cyan-500"
                      : "text-cyan-600 hover:text-cyan-700 decoration-cyan-300 hover:decoration-cyan-400"
                  } underline transition-colors duration-300  items-center gap-1 inline-flex`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  the official Aoi syntax guide
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </span>
            </li>
          </ul>

          <div
            className={`absolute bottom-2 right-2 text-xs ${
              theme === "dark" ? "text-indigo-500/30" : "text-indigo-500/50"
            }`}
          >
            v1.3.0
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`w-full max-w-6xl mt-12 text-center text-xs ${
          theme === "dark" ? "text-indigo-500/50" : "text-indigo-600/70"
        }`}
      >
        <p>Aoi Interpreter • Built with Next.js and Rust </p>
        <p>Made by Aadi </p>
      </motion.div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </main>
  )
}
