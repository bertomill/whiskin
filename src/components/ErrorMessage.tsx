interface ErrorMessageProps {
  error: string | null;
  success: string | null;
  onClear: () => void;
}

export default function ErrorMessage({ error, success, onClear }: ErrorMessageProps) {
  if (!error && !success) return null;

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {error && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            <span className="text-red-300 font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-green-300 font-medium">{success}</span>
          </div>
        </div>
      )}
    </div>
  );
} 