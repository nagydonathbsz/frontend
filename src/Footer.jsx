import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() { 
    return (    
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>EuroTrip ✈️</h3>
                    <p>
                        Fedezd fel Európa fővárosait, találj prémium szállásokat és válogass a legjobb éttermek közül egy helyen.
                    </p>
                </div>

                <div className="footer-section contact">
                    <h3>Kapcsolat</h3>
                    <p><FaEnvelope /> info@eurotrip.hu</p>
                    <p><FaPhoneAlt /> +36 1 234 5678</p>
                    <p><FaMapMarkerAlt /> 9700 Szombathely, Zrínyi Ilona utca 12.</p>
                </div>

                <div className="footer-section social">
                    <h3>Kövess minket</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} EuroTrip Project | Vizsgaremek 2026
            </div>
        </footer>
    );
}

export default Footer;