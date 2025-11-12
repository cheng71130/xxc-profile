import { createApp } from 'vue';
import NotificationContainer from './NotificationContainer.vue';
import type { NotificationOptions } from './types.ts';

class NotificationManager {
    private instance: any = null;
    private container: HTMLDivElement | null = null;

    private ensureInstance() {
        if (!this.instance) {
            this.container = document.createElement('div');
            document.body.appendChild(this.container);

            const app = createApp(NotificationContainer);
            this.instance = app.mount(this.container);
        }
        return this.instance;
    }

    private show(options: NotificationOptions) {
        const instance = this.ensureInstance();
        return instance.addNotification(options);
    }

    success(title: string, message?: string, options?: Partial<NotificationOptions>) {
        return this.show({
            type: 'success',
            title,
            message,
            ...options,
        });
    }

    error(title: string, message?: string, options?: Partial<NotificationOptions>) {
        return this.show({
            type: 'error',
            title,
            message,
            ...options,
        });
    }

    warning(title: string, message?: string, options?: Partial<NotificationOptions>) {
        return this.show({
            type: 'warning',
            title,
            message,
            ...options,
        });
    }

    info(title: string, message?: string, options?: Partial<NotificationOptions>) {
        return this.show({
            type: 'info',
            title,
            message,
            ...options,
        });
    }

    close(id: number) {
        if (this.instance) {
            this.instance.removeNotification(id);
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
            this.instance = null;
            this.container = null;
        }
    }
}

export const Notification = new NotificationManager();
