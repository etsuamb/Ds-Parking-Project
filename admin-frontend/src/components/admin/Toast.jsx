import { useEffect } from 'react';
import { CheckIcon, AlertIcon, XIcon } from './Icons';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-slate-800',
      border: 'border-l-4 border-green-500',
      icon: <CheckIcon className="w-5 h-5 text-green-400" />,
      text: 'text-gray-100'
    },
    error: {
      bg: 'bg-slate-800',
      border: 'border-l-4 border-red-500',
      icon: <AlertIcon className="w-5 h-5 text-red-400" />,
      text: 'text-gray-100'
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-md w-full ${style.bg} ${style.border} rounded-lg card-shadow-hover p-4 flex items-center justify-between transform transition-all duration-300 animate-slide-in`}>
      <div className="flex items-center flex-1">
        <div className="flex-shrink-0 mr-3">
          {style.icon}
        </div>
        <p className={`text-sm font-medium ${style.text}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

