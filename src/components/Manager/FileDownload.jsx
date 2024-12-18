import React from 'react';

const FileDownload = () => {
    // Path to the template file stored in the public folder
    const handleDownload = () => {
        const filePath = '/import_template.xlsx';  // Relative path to the template file in the public folder

        // Create an invisible link element
        const link = document.createElement('a');
        link.href = filePath;
        link.download = 'import_template.xlsx';  // Filename to save as when downloading

        // Trigger the download by simulating a click on the link
        link.click();
    };

    return (
        <div>
            <button
                onClick={handleDownload}
                className="w-40 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
                Tải template
            </button>
        </div>
    );
};

export default FileDownload;
