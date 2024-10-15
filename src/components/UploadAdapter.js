// src/UploadAdapter.js
export default class UploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }
  
    upload() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          setTimeout(() => {
            resolve({ default: reader.result });
          }, 1000);
        };
        reader.onerror = () => {
          reject("Upload failed");
        };
        reader.readAsDataURL(this.loader.file);
      });
    }
  
    abort() {
      // Handle abort if needed
    }
  }