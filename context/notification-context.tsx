'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // milliseconds, optional
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
}

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

function NotificationContainer({
  notifications,
  onRemove,
}: NotificationContainerProps) {
  return (
    <div className="fixed top-5 right-5 flex flex-col space-y-2 z-50">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`max-w-sm px-4 py-3 rounded shadow-md text-white cursor-pointer select-none
            ${
              type === 'success'
                ? 'bg-green-600'
                : type === 'error'
                ? 'bg-red-600'
                : type === 'warning'
                ? 'bg-yellow-500 text-black'
                : 'bg-blue-600'
            }`}
          onClick={() => onRemove(id)}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      ))}
    </div>
  );
}
