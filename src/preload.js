import { ipcRenderer } from 'electron';

ipcRenderer.on('file-opened', (_, file, content) => {
    console.log('file-opened', { file, content });
});