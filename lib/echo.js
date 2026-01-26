import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from './axios';

window.Pusher = Pusher;

const rawHost = import.meta.env.VITE_REVERB_HOST;
const cleanHost = rawHost.replace(/^https?:\/\//, '');

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'r3gsjcfspwykeqttktno',
    wsHost: cleanHost,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],

    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                apiClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
            }
        };
    },
});

export default echo;