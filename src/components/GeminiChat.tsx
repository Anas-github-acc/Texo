"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Paperclip } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Import KaTeX styles

interface Message {
  id: string;
  content: string;
  sender: "user" | "gemini";
  attachment?: string;
}

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeminiChat({ isOpen, onClose }: GeminiChatProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I am Friday. How can I help you today?",
      sender: "gemini",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(384); // Default width in pixels (md:w-96 = 384px)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  // Handle resizing
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing.current && panelRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        // Restrict width between 300px and 800px
        if (newWidth >= 300 && newWidth <= 800) {
          setPanelWidth(newWidth);
        }
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() && !attachment) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        content: prompt,
        sender: "user",
        attachment: attachment || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError("");

      const geminiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: geminiMessageId, content: "", sender: "gemini" }]);

      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.text) {
                accumulatedResponse += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === geminiMessageId
                      ? { ...msg, content: accumulatedResponse }
                      : msg
                  )
                );
              }
            } catch (err) {
              console.warn("Chunk parse error:", err);
            }
          }
        }
      } catch (err) {
        setError("Failed to stream response.");
        console.error(err);
      } finally {
        setLoading(false);
        setPrompt("");
        setAttachment(null);
      }
    },
    [prompt, attachment]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={panelRef}
      className={`fixed inset-y-0 right-0 bg-background shadow-xl z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: `${panelWidth}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 left-0 w-2 h-full bg-gray-300 cursor-ew-resize hover:bg-gray-400"
        onMouseDown={startResizing}
      />

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">Tokio Chat</h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-foreground/80 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  <Markdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      table: ({ children }) => (
                        <table className="border-collapse border border-gray-300 my-2">
                          {children}
                        </table>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
                {message.attachment && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Attachment:</span>{" "}
                    {message.attachment}
                  </div>
                )}
              </div>
            </div>
          ))}
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {attachment && (
          <div className="px-4 py-2 bg-secondary border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-foreground">
                Attachment: {attachment}
              </span>
              <button
                onClick={() => setAttachment(null)}
                className="text-destructive hover:text-destructive/80"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAttachment}
              className="text-foreground/80 hover:text-foreground focus:outline-none"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-secondary text-secondary-foreground border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || (!prompt.trim() && !attachment)}
              className={`p-2 rounded-full ${
                loading || (!prompt.trim() && !attachment)
                  ? "bg-secondary text-secondary-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}