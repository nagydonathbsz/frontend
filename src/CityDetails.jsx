import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccommodationDetails from './AccommodationDetails';
import RestaurantDetails from './RestaurantDetails'; 

function CityDetails() {
    const { cityId } = useParams();
    const navigate = useNavigate();
    
    const [city, setCity] = useState(null);
    const [accommodations, setAccommodations] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [activeTab, setActiveTab] = useState('hotels');
    const [loading, setLoading] = useState(true);

    const [selectedAcco, setSelectedAcco] = useState(null);
    const [selectedRest, setSelectedRest] = useState(null);

    useEffect(() => {
        const fetchEverything = async () => {
            setLoading(true);
            try {
                // 1. Város adatainak lekérése (hogy tudjuk a nevét a képhez és a címhez)
                const cityRes = await fetch(`https://localhost:7046/api/City/${cityId}`);
                if (cityRes.ok) {
                    const cityData = await cityRes.json();
                    setCity(cityData);
                }

                // 2. Szállások lekérése
                const accRes = await fetch(`https://localhost:7046/api/Accommodation/city/${cityId}`); 
                if (accRes.ok) {
                    const accData = await accRes.json();
                    setAccommodations(Array.isArray(accData) ? accData : []);
                }

                // 3. Éttermek lekérése
                const restRes = await fetch(`https://localhost:7046/api/Restaurant/city/${cityId}`);
                if (restRes.ok) {
                    const restData = await restRes.json();
                    setRestaurants(Array.isArray(restData) ? restData : []);
                }
            } catch (error) {
                console.error("Hiba az adatok lekérésekor", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEverything();
    }, [cityId]);

    if (loading) return <div className="container">Betöltés...</div>;
    if (!city) return <div className="container">A város nem található.</div>;

    if (selectedAcco) {
        return <AccommodationDetails hotel={selectedAcco} onBack={() => setSelectedAcco(null)} />;
    }

    if (selectedRest) {
        return <RestaurantDetails restaurant={selectedRest} onBack={() => setSelectedRest(null)} />;
    }

    return (
        <div className="container">
            {/* A navigate(-1) visszadob az előző oldalra (Dashboard) */}
            <button className="back-btn" onClick={() => navigate(-1)}>← Vissza a listához</button>
            
            <div className="detail-hero">
                <img 
                    src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_1200,h_400,c_fill,g_auto,f_auto,q_auto/${city.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                    alt={city.name} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/1200x400?text=EuroTrip'}
                />
                <div className="hero-text">
                    <h1>{city.name}</h1>
                </div>
            </div>

            <div className="tab-menu">
                <button 
                    className={activeTab === 'hotels' ? 'active' : ''} 
                    onClick={() => setActiveTab('hotels')}
                >
                    Szálláshelyek ({accommodations.length})
                </button>
                <button 
                    className={activeTab === 'restaurants' ? 'active' : ''} 
                    onClick={() => setActiveTab('restaurants')}
                >
                    Éttermek ({restaurants.length})
                </button>
            </div>

            <div className="grid">
                {activeTab === 'hotels' ? (
                    accommodations.length > 0 ? (
                        accommodations.map(acc => (
                            <div key={acc.id} className="sub-card"> 
                            <h3>{acc.name}</h3>
                                <p>📍 {acc.address}</p>
                                <button className="book-btn" onClick={() => setSelectedAcco(acc)}>Megtekintés</button>
                            </div>
                        ))
                    ) : <p>Nincs elérhető szálláshely.</p>
                ) : (
                    restaurants.length > 0 ? (
                        restaurants.map(rest => (
                            <div key={rest.id} className="sub-card">
                                <h3>{rest.name}</h3>
                                <p>📍 {rest.address}</p>
                                <button className="book-btn" onClick={() => setSelectedRest(rest)}>Megtekintés</button>
                            </div>
                        ))
                    ) : <p>Nincs elérhető étterem.</p>
                )}
            </div>
        </div>
    );
}

export default CityDetails;