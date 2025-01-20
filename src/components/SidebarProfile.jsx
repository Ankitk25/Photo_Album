import React from 'react';

const SidebarProfile = () => {
    const albums = [
        { id: 1, title: 'Vacation', thumbnail: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 2, title: 'Family', thumbnail: 'https://images.pexels.com/photos/1914984/pexels-photo-1914984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 3, title: 'Friends', thumbnail: 'https://images.pexels.com/photos/1974927/pexels-photo-1974927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    ];

    return (
        <div className="md:w-64 w-full p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-6">
                <img src="https://www.shutterstock.com/shutterstock/photos/2360352877/display_1500/stock-photo-bologna-italy-september-the-famous-batman-logo-to-celebrate-the-batman-day-2360352877.jpg" alt="Profile Picture" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-300 shadow-sm"/>
                <h2 className="text-xl font-semibold text-gray-800">Guest</h2>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Albums</h3>
                <ul className="space-y-4">
                    {albums.map((album) => (
                        <li key={album.id} className="flex items-center space-x-4">
                            <img src={album.thumbnail} alt={album.title} className="w-16 h-16 rounded-md object-cover border-2 border-gray-200"/>
                            <span className="text-md text-gray-700">{album.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <br />
        </div>
    );
};

export default SidebarProfile;
