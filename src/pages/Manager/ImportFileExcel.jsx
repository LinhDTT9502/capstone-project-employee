import React, { useState } from "react";

const ImportFileExcel = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle API call
    const handleImport = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("importFile", selectedFile);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                "https://capstone-project-703387227873.asia-southeast1.run.app/api/Product/import-product-from-excel",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.status === 200) {
                alert("Import successful!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while importing the file.");
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleImport}>Import</button>
        </div>
    );
};

export default ImportFileExcel;
