import React, { useState, useEffect } from 'react';
import ImageCard from './components/ImageCard';
import ImageSearch from './components/ImageSearch';
import PhotoUpload from './components/PhotoUpload';
import SidebarProfile from './components/SidebarProfile';

function App() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [term, setTerm] = useState('');

    useEffect(() => {
        const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
        fetch(`https://pixabay.com/api/?key=${apiKey}&q=${term}&image_type=photo&pretty=true`)
            .then(res => res.json())
            .then(data => {
                setImages(data.hits);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }, [term]);

    return (
        <div className="flex">
            <SidebarProfile />
            <h1 className="text-5xl font-bold text-center mx-auto mt-10 text-teal-500 ">
                    Image Gallery
            </h1>
            <div className="container mx-auto">
                <div className="flex items-center justify-between p-4">
                    <ImageSearch searchText={(text) => setTerm(text)} />
                    <PhotoUpload />
                </div>
                
                {!isLoading && images.length === 0 && <h1 className="text-5xl text-center mx-auto mt-32">No Images Found</h1>}
                {isLoading ? <h1 className="text-6xl text-center mx-auto mt-32">Loading...</h1> : <div className="grid grid-cols-3 gap-4">
                    {images.map(image => (
                        <ImageCard key={image.id} image={image} />
                    ))}
                </div>}
            </div>
        </div>
    );
}

export default App;
