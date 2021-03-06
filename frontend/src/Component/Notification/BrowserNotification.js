import Images from 'Theme/Images';
import { levels } from 'react-notification-system/src/constants';

const NOTIFICATION_DURATION = 5000;

/* eslint-disable */
const PERMISSION_TYPE_DENIED = 'denied';
const PERMISSION_TYPE_DEFAULT = 'default';
const PERMISSION_TYPE_GRANTED = 'granted';
/* eslint-enable */

class BrowserNotification {
  constructor() {
    // Check if Browser is support notification or not
    if (!window.Notification) {
      this.permission = PERMISSION_TYPE_DENIED;
      return;
    }

    // If supported bind it
    this.permission = window.Notification.permission;

    switch (this.permission) {
      case PERMISSION_TYPE_DENIED:
        break;
      case PERMISSION_TYPE_DEFAULT:
        window.Notification.requestPermission();
        break;
      default:
        break;
    }
    /**
     * Apply notification levels:
     * - info
     * - success
     * - warning
     * - error
     */
    /* eslint-disable array-callback-return */
    Object.keys(levels).map(key => {
      const level = levels[key];
      this[level] = notification => this.notify(notification);
    });
  }

  notify({ title, message, duration, ...others } = {}) {
    // Ignore when permission is not GRANTED
    if (this.permission === PERMISSION_TYPE_DENIED) {
      return undefined;
    }

    const notification = new window.Notification(title, {
      body: message,
      icon: Images.logo,
      ...others,
    });

    // Close notification when reach the end of duration
    setTimeout(() => {
      notification.close();
    }, duration || NOTIFICATION_DURATION);

    return notification;
  }
}

export default BrowserNotification;
