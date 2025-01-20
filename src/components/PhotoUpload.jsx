import React, { useState } from 'react';
import axios from 'axios';

const PhotoUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setPreview(URL.createObjectURL(event.target.files[0]));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('YOUR_API_ENDPOINT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <input type="file" onChange={handleFileChange} className="px-4 py-2 border border-gray-300 rounded-md" />
                {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover mt-2 rounded-md" />}
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Upload</button>
            </form>
        </div>
    );
};

export default PhotoUpload;
