import { useEffect } from "react";

const NotificationModal = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const buttonColor = isSuccess
    ? "bg-green-600 hover:bg-green-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="notification-surface rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div
            className={`flex items-center justify-center w-12 h-12 mx-auto ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            } rounded-full mb-4`}
          >
            {isSuccess ? (
              <svg
                className={`w-6 h-6 text-green-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className={`w-6 h-6 text-red-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h3
            className={`text-lg font-semibold text-gray-900 text-center mb-2`}
          >
            {isSuccess ? "Success!" : "Error"}
          </h3>
          <p className="text-sm text-muted text-center mb-6">{message}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`px-6 py-2 text-sm font-medium text-white ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
