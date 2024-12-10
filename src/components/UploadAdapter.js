function MyUploadAdapter(loader) {
  this.loader = loader;
}

MyUploadAdapter.prototype.upload = function () {
  return this.loader.file.then(
    (file) =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        // Replace with your actual image upload API endpoint
        fetch('/your-image-upload-endpoint', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.url) {
              resolve({ default: data.url });
            } else {
              reject('Upload failed.');
            }
          })
          .catch((error) => reject(error));
      })
  );
};

MyUploadAdapter.prototype.abort = function () {
  // Abort logic, if needed
};

// Add a custom upload adapter to CKEditor
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
