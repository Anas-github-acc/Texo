# 📄Texo - Google Docs Clone with Tiptap Editor

A modern, feature-rich document editor built with Next.js and Tiptap, offering real-time collaboration and AI-powered assistance. This project combines powerful editing capabilities with seamless collaboration features.

## ✨ Key Features

### 📝 Rich Text Editing

- Full-featured text formatting (bold, italic, underline)
- Multiple heading levels
- Nested lists (bullet and numbered)
- Task lists with checkboxes
- Code blocks with syntax highlighting
- Custom font families and sizes
- Text alignment options
- Line height control
- Table support with resizable columns
- Image insertion with resize capability
- Horizontal rules and text highlighting

### 👥 Real-time Collaboration

- Multi-user simultaneous editing
- Cursor presence indicators
- User attribution for edits
- Collaborative comments and threads
- Real-time conflict resolution
- Offline support with automatic syncing

### 🤖 AI Integration

- Gemini API enables real-time AI chat support. (Streaming response using ReadableStream)
- RAG pipeline ensures precise, efficient document query processing.

### 📂 Document Management

- Create and organize documents
- Auto-saving functionality
- Document templates
- Export to multiple formats (.html, .json, .txt, .pdf)
- Search functionality
- Organization-based document sharing

### 💻 Code Editing Features

- **Monaco Editor Integration** (@monaco-editor/react)
  - Syntax highlighting for multiple languages
  - Multi-file support
    - HTML
    - CSS
    - JavaScript
  - Live code execution
  - Real-time preview
  - Code formatting
  - Error highlighting
  - Line numbers and minimap

## 🛠️ Technical Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tiptap**: Rich text editor framework
- **Monaco Editor**: Code editing capabilities
- **TailwindCSS**: Utility-first CSS
- **ShadcN UI**: Modern UI components
- **Lucide Icons**: Beautiful icon set

### Real-time Features

- **Liveblocks**: Real-time collaboration engine
- **WebSocket**: Real-time communication
- **Presence API**: User presence tracking

### Backend & Database

- **Convex**: Backend framework with real-time capabilities
- **API Routes**: Server-side functionality

### AI & Machine Learning

[visit](https://github.com/Anas-github-acc/texo-rag) the link for more details.

### Authentication & Security

- **Clerk**: User authentication and management
- **JWT**: Secure token-based auth
- **Organization-based** access control

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Liveblocks account
- Google AI API key
- Clerk account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AadiS27/Texo
cd Texo
```

2. Install dependencies (use  --legacy-peer-deps if you encounter issues):

```bash
npm install
```

or use pnpm (recommended):

```bash
pnpm install
```

3. Create a .env.local file in the root directory:

```env
cp .env.template .env.local
```

4. Fill in the .env.local file:

```env
CONVEX_DEPLOYMENT=your_convex_deployment_id
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
LIVEBLOCK_SPECIAL_KEY=your_liveblocks_special_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:

```bash
npm run dev
```

or with pnpm:

```bash
pnpm run dev
```

## 📦 Project Structure (Basic)

```
src/
├── app/
|   ├── api/            # API routes  
│   ├── code/           # Code playground components
│   └── documents/      # Document editor components
├── components/         # Reusable components
├── store/             # State management
├── lib/               # Utility functions
├── extensions/        # Tiptap extensions
└── constants/         # Constants and types
```

## 🤝 Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## 📄 License

License :: OSI Approved :: GNU General Public License v3 (GPLv3)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Tiptap Editor](https://tiptap.dev/)
- [Next.js](https://nextjs.org/)
- [ShadcN UI](https://shadcn.dev/)
- [Liveblocks](https://liveblocks.io/)
- [Convex](https://www.convex.dev/)
- [Google Gemini](https://ai.google.dev/)
