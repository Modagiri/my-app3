import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
    showOpenDialog: () => {
        ipcRenderer.send('show-open-dialog');
    },
    onFileOpen: (callback) => {
        ipcRenderer.on('file-opened', (_, content) => {
            callback(content);
        });
    }
});