"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Paperclip, FileIcon } from "lucide-react";
import Markdown from "react-markdown"; // Import Markdown component for rendering markdown content
import remarkGfm from "remark-gfm"; // Import remark-gfm for GitHub Flavored Markdown
import remarkMath from "remark-math"; // Import remark-math for math rendering
import rehypeKatex from "rehype-katex"; // Import KaTeX for math rendering
import "katex/dist/katex.min.css"; // Import KaTeX styles
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "gemini";
  attachment?: string;
}

interface Document {
  _id: string;
  title: string;
  organizationId?: string;
}

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent?: string; // Changed from document to documentContent
}

export default function GeminiChat({ isOpen, onClose, documentContent }: GeminiChatProps) {
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
  const [panelWidth, setPanelWidth] = useState(684); // Default width in pixels (md:w-96 = 384px)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const documents = useQuery(api.documents.get, {
    search: undefined,
    paginationOpts: { numItems: 10, cursor: null }
  });


  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const params = useParams();

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
        if (newWidth >= 300 && newWidth <= 1300) {
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
      setMessages((prev) => [
        ...prev,
        { id: geminiMessageId, content: "", sender: "gemini" },
      ]);

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            documentId: selectedDocument?._id,
            organizationId: selectedDocument?.organizationId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

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
    [prompt, attachment, selectedDocument]
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

  const handleDocumentSelect = async (document: Document) => {
    setSelectedDocument(document);
    setIsDocumentDialogOpen(false);
    setLoading(true);
    setError("");

    try {
      // First, process the document
      const processResponse = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentId: document._id,
          content: documentContent // Changed to send content instead of ID
        }),
      });

      if (!processResponse.ok) {
        throw new Error(`Failed to process document: ${processResponse.status}`);
      }

      // Only proceed with Gemini query if there's a prompt
      if (!prompt.trim()) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          documentId: document._id,
          organizationId: document.organizationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.text) {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.sender === "gemini") {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, content: last.content + data.text },
                  ];
                }
                return [...prev, { id: Date.now().toString(), content: data.text, sender: 'gemini' }];
              });
            }
          } catch (e) {
            console.error('Error parsing stream:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error processing document:', error);
      setError('Failed to process document.');
    } finally {
      setLoading(false);
    }
  };

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
            <button
              type="button"
              onClick={() => setIsDocumentDialogOpen(true)}
              className="text-foreground/80 hover:text-foreground focus:outline-none"
            >
              <FileIcon size={20} />
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
              disabled={loading || (!prompt.trim() && !attachment && !selectedDocument)}
              className={`p-2 rounded-full ${
                loading || (!prompt.trim() && !attachment && !selectedDocument)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          {selectedDocument && (
            <div className="mt-2 px-2 py-1 bg-secondary rounded-md text-sm flex items-center gap-2">
              <FileIcon size={16} />
              <span>{selectedDocument.title}</span>
              <button
                onClick={() => setSelectedDocument(null)}
                className="ml-auto hover:text-foreground/80"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </form>

        <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Document</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-2 p-2">
                {documents?.page.map((doc: Document) => (
                  <button
                    key={doc._id}
                    onClick={() => handleDocumentSelect(doc)}
                    className="w-full text-left px-4 py-2 hover:bg-secondary rounded-md flex items-center gap-2"
                  >
                    <FileIcon size={16} />
                    <span>{doc.title}</span>
                    {doc._id === params?.documentId && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
