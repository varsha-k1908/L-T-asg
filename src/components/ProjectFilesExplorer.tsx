import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileCode, 
  Database, 
  Terminal, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Play, 
  CheckCircle2, 
  Search,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProjectFile {
  path: string;
  name: string;
  category: string;
  language: string;
  description: string;
  size?: number;
  exists?: boolean;
}

export const ProjectFilesExplorer: React.FC = () => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('server.ts');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [loadingContent, setLoadingContent] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch list of files
  useEffect(() => {
    fetch('/api/project-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.files)) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.error('Error fetching project files:', err));
  }, []);

  // Fetch content of selected file
  useEffect(() => {
    if (!selectedFilePath) return;
    setLoadingContent(true);
    fetch(`/api/file-content?path=${encodeURIComponent(selectedFilePath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFileContent(data.content || '');
          setFileSize(data.size || 0);
        } else {
          setFileContent(`// Unable to read file content: ${data.message}`);
        }
      })
      .catch((err) => {
        setFileContent(`// Error loading file: ${err.message}`);
      })
      .finally(() => {
        setLoadingContent(false);
      });
  }, [selectedFilePath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const selectedFile = files.find((f) => f.path === selectedFilePath);

  const categories = ['All', 'Backend & API', 'Frontend', 'Database', 'Configuration', 'Documentation'];

  const filteredFiles = files.filter((f) => {
    const matchCat = filterCategory === 'All' || f.category === filterCategory;
    const matchSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Backend & API':
        return <Terminal className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Frontend':
        return <Layers className="w-3.5 h-3.5 text-blue-500" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-amber-500" />;
      case 'Documentation':
        return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Success banner acknowledging normal conversion */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Zip Extracted to Normal Files
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                  Active &amp; Normal
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                The archive <code className="bg-slate-200/70 px-1 py-0.5 rounded text-[11px] font-mono text-slate-800">L-T-asg-main__1__9baa51b8.zip</code> has been completely uncompressed into standard source files. You can explore, copy, and download any individual file or the entire build below.
              </p>
            </div>
          </div>

          {/* Quick downloads */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href="/Student_Registration_and_Management_System_Architecture_Document.docx"
              download="Student_Registration_and_Management_System_Architecture_Document.docx"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl shadow-xs transition"
              title="Download Word Document formatted in Times New Roman 12pt"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Architecture (.DOCX)</span>
            </a>
            <a
              href="/public/student-registration-app.zip"
              download="student-registration-app.zip"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project .ZIP</span>
            </a>
            <a
              href="/api/download-file?path=student_registration_single_file.js"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition"
              title="Standalone runnable single file"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standalone .JS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Split View: Left File List + Right Code Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:flex-row min-h-[620px]">
        {/* Left Column: File Explorer */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Header & Search */}
          <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Folder className="w-4 h-4 text-indigo-600" />
                <span>Project Files ({filteredFiles.length})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Uncompressed</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[500px] lg:max-h-[600px]">
            {filteredFiles.map((f) => {
              const isSelected = f.path === selectedFilePath;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFilePath(f.path)}
                  className={`w-full text-left p-3 flex items-start gap-2.5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 text-indigo-900 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getCategoryIcon(f.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold truncate">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {formatBytes(f.size)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {f.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-1 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No files found matching criteria.
              </div>
            )}
          </div>

          {/* Bottom stats */}
          <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total normal files: {files.length}</span>
            <span className="text-emerald-600 font-medium">Ready to run</span>
          </div>
        </div>

        {/* Right Column: Code Viewer & Actions */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-200">
          {/* File Action Bar */}
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white truncate">
                    {selectedFilePath}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-slate-800 text-slate-300 rounded font-mono">
                    {selectedFile?.language || 'code'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedFile?.description} ({formatBytes(fileSize)})
                </div>
              </div>
            </div>

            {/* Actions for current file */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <a
                href={`/api/download-file?path=${encodeURIComponent(selectedFilePath)}`}
                download={selectedFile?.name || 'file'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </a>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed max-h-[580px] bg-slate-950">
            {loadingContent ? (
              <div className="h-40 flex items-center justify-center text-slate-400 text-xs">
                Loading normal file content...
              </div>
            ) : (
              <pre className="text-slate-200 whitespace-pre overflow-x-auto">
                <code>{fileContent}</code>
              </pre>
            )}
          </div>

          {/* Quick instructions bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Full uncompressed file from workspace</span>
            </span>
            <span className="font-mono text-slate-500">{fileContent.split('\n').length} lines</span>
          </div>
        </div>
      </div>

      {/* How to Run Normally Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Method 1: Zero-Dependency Single File */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Play className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Method 1: Instant Standalone (No npm install)
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Fastest
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Run the entire full-stack app (REST API + frontend Web UI) directly using pure Node.js without needing <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">npm install</code>:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
            <code>node student_registration_single_file.js</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('node student_registration_single_file.js');
              }}
              className="text-slate-400 hover:text-white p-1"
              title="Copy command"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Then open <span className="font-semibold text-slate-700">http://localhost:3000</span> in any browser.
          </p>
        </div>

        {/* Method 2: Full Dev Server */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Method 2: Full-Stack React + Node
              </h3>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
              Standard
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Run the modular Vite + React + Express server with hot reload and TypeScript compilation:
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
            <code>npm install &amp;&amp; npm run dev</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('npm install && npm run dev');
              }}
              className="text-slate-400 hover:text-white p-1"
              title="Copy command"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Runs Express REST backend on port 3000 with Vite React SPA.
          </p>
        </div>
      </div>
    </div>
  );
};
