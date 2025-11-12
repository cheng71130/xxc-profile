export interface NotificationOptions {
    type?: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    duration?: number;
}

export interface Notification extends Required<NotificationOptions> {
    id: number;
    timer?: number;
    pausedTime?: number;
    startTime?: number;
}
