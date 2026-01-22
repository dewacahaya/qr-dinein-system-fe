import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'r3gsjcfspwykeqttktno',
    wsHost: import.meta.env.VITE_REVERB_HOST || 'abbded0cdab9.ngrok-free.app',
    wsPort: import.meta.env.VITE_REVERB_PORT || 443,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
});

export default echo;