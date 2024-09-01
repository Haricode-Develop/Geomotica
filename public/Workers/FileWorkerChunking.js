// FileWorkerChunking.js
self.onmessage = (e) => {
    const { file, chunkSize, chunkIndex } = e.data;
    const chunk = file.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize);
    self.postMessage({ chunk, chunkIndex });
};
