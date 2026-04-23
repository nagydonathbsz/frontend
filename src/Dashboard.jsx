import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ onCitySelect }) {
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');
    const navigate = useNavigate();

    const getCityImgUrl = (cityName) => {
        if (!cityName) return '';
        const normalized = cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const fileName = normalized.toLowerCase().replace(/\s+/g, '-');
        const cloudName = "duqxzcf4e";
        return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_250,c_fill,g_auto,f_auto,q_auto/${fileName}.jpg`;
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('https://localhost:7046/api/City');
                if (!response.ok) throw new Error('Hiba a városok betöltésekor');
                const data = await response.json();
                setCities(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    const filteredCities = cities.filter(c => 
        c.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    function handleCityClick(city) {
        if (onCitySelect) onCitySelect(city); 
        navigate(`/citys/${city.id || city.city_id}`);
    }

    return (
        <div className="container">
            <header className="page-header">
                <h1>Európai Úticélok</h1>
            </header>

            <div className="search-bar" style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Város keresése..." 
                    value={searchCity} 
                    onChange={(e) => setSearchCity(e.target.value)} 
                />
            </div>

            <div className="grid">
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                {loading && (
                    <div className="loading-spinner-wrapper">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                {!loading && filteredCities.map((city) => (
                    <div 
                        key={city.id || city.city_id} 
                        className="city-card" 
                        onClick={() => handleCityClick(city)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-image">
                            <img 
                                src={getCityImgUrl(city.name)} 
                                alt={city.name}
                                onError={(e) => { 
                                    e.target.src = 'https://via.placeholder.com/400x250?text=Kep+feltoltes+alatt'; 
                                }}
                            />
                        </div>
                            <div className="card-content">
                                <h1>{city.name}</h1>
                                <p>{city?.country?.name}</p> 
                            </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;