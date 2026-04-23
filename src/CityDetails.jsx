import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccommodationDetails from './AccommodationDetails';
import RestaurantDetails from './RestaurantDetails';

const MAX_HOTEL_IMAGES = 68;
const MAX_REST_IMAGES = 74;

function DynamicImage({ src, alt }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="image-wrapper">
            {isLoading && <div className="loading-spinner"></div>}
            <img
                src={src}
                alt={alt}
                className={`dynamic-card-img ${isLoading ? 'img-loading' : 'img-loaded'}`}
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                    setIsLoading(false);
                    e.target.src = 'https://via.placeholder.com/400x250?text=Kép+nem+elérhető';
                }}
            />
        </div>
    );
}

function StarRating({ rating }) {
    const val = rating ?? 0;
    const full = Math.floor(val);
    const half = val - full >= 0.5;
    return (
        <span className="star-rating">
            {[1,2,3,4,5].map(i => (
                <span key={i} className={i <= full ? 'star filled' : (i === full + 1 && half ? 'star half' : 'star empty')}>★</span>
            ))}
            <span className="rating-value">{val.toFixed(1)}</span>
        </span>
    );
}

function CityDetails() {
    const { cityId } = useParams();
    const navigate = useNavigate();
    const cityOffset = parseInt(cityId) || 0;

    const [city, setCity] = useState(null);
    const [accommodations, setAccommodations] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [activeTab, setActiveTab] = useState('hotels');
    const [loading, setLoading] = useState(true);
    const [minRating, setMinRating] = useState(0);

    const [selectedAcco, setSelectedAcco] = useState(null);
    const [selectedRest, setSelectedRest] = useState(null);

    useEffect(() => {
        const fetchEverything = async () => {
            setLoading(true);
            try {
                const cityRes = await fetch(`https://localhost:7046/api/City/${cityId}`);
                if (cityRes.ok) setCity(await cityRes.json());

                const accRes = await fetch(`https://localhost:7046/api/Accommodation/city/${cityId}`);
                if (accRes.ok) {
                    const accData = await accRes.json();
                    setAccommodations(Array.isArray(accData) ? accData : []);
                }

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

    if (loading) return (
        <div className="loading-spinner-wrapper" style={{ minHeight: '60vh' }}>
            <div className="loading-spinner"></div>
        </div>
    );
    if (!city) return <div className="container">A város nem található.</div>;

    if (selectedAcco) return <AccommodationDetails hotel={selectedAcco} onBack={() => setSelectedAcco(null)} cityOffset={cityOffset} maxImages={MAX_HOTEL_IMAGES} />;
    if (selectedRest) return <RestaurantDetails restaurant={selectedRest} onBack={() => setSelectedRest(null)} cityOffset={cityOffset} maxImages={MAX_REST_IMAGES} />;

    const filteredAcco = accommodations.filter(a => (a.rating ?? 0) >= minRating);
    const filteredRest = restaurants.filter(r => (r.rating ?? 0) >= minRating);

    return (
        <div className="city-details-page">
            <div className="city-hero" style={{backgroundImage: `linear-gradient(rgba(15,23,42,0.5), rgba(15,23,42,0.5)), url('https://res.cloudinary.com/duqxzcf4e/image/upload/w_1600,h_500,c_fill,g_auto,f_auto,q_auto/${city.name.toLowerCase().replace(/\s+/g, '-')}.jpg')`}}>
                <button className="back-btn city-hero-back" onClick={() => navigate(-1)}>← Vissza</button>
                <h1 className="city-hero-title">{city.name}</h1>
            </div>

            <div className="city-details-controls">
                <div className="tab-menu">
                    <button
                        className={activeTab === 'hotels' ? 'active' : ''}
                        onClick={() => setActiveTab('hotels')}
                    >
                        Szálláshelyek ({filteredAcco.length})
                    </button>
                    <button
                        className={activeTab === 'restaurants' ? 'active' : ''}
                        onClick={() => setActiveTab('restaurants')}
                    >
                        Éttermek ({filteredRest.length})
                    </button>
                </div>

                <div className="rating-filter">
                    <span className="rating-filter-label">Min. értékelés:</span>
                    {[0,1,2,3,4,5].map(val => (
                        <button
                            key={val}
                            className={`rating-filter-btn ${minRating === val ? 'active' : ''}`}
                            onClick={() => setMinRating(val)}
                        >
                            {val === 0 ? 'Mind' : `${val}★`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container city-details-body">
                <div className="grid">
                    {activeTab === 'hotels' ? (
                        filteredAcco.length > 0 ? (
                            filteredAcco.map(acc => (
                                <div key={acc.id} className="sub-card">
                                    <DynamicImage 
                                        src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_400,h_250,c_fill,g_auto,f_auto,q_auto/hotel-${((acc.id + cityOffset) % MAX_HOTEL_IMAGES) + 1}.jpg`} 
                                        alt={acc.name}
                                    />
                                    <h3>{acc.name}</h3>
                                    <p>📍 {acc.address}</p>
                                    <StarRating rating={acc.rating} />
                                    <button className="book-btn" onClick={() => setSelectedAcco(acc)}>Megtekintés</button>
                                </div>
                            ))
                        ) : <p>Nincs találat a megadott értékelési szűrőre.</p>
                    ) : (
                        filteredRest.length > 0 ? (
                            filteredRest.map(rest => (
                                <div key={rest.id} className="sub-card">
                                    <DynamicImage 
                                        src={`https://res.cloudinary.com/duqxzcf4e/image/upload/w_400,h_250,c_fill,g_auto,f_auto,q_auto/rest-${((rest.id + cityOffset) % MAX_REST_IMAGES) + 1}.jpg`} 
                                        alt={rest.name}
                                    />
                                    <h3>{rest.name}</h3>
                                    <p>📍 {rest.address}</p>
                                    <StarRating rating={rest.rating} />
                                    <button className="book-btn" onClick={() => setSelectedRest(rest)}>Megtekintés</button>
                                </div>
                            ))
                        ) : <p>Nincs találat a megadott értékelési szűrőre.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CityDetails;