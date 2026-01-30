interface ErrorProps {
  error: string;
}
export function Error({ error }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md space-y-4">
        <p className="text-lg text-red-600 font-semibold">Error: {error}</p>
        {error.includes('not authenticated') && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Please try refreshing the page or sign in again.
            </p>
            <a 
              href="/" 
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              Go to home page
            </a>
          </div>
        )}
        {error.includes('No projects found') && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Create your first project to get started.
            </p>
            <a 
              href="/create" 
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-black/90"
            >
              Create Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}