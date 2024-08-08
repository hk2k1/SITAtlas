'use client';
import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Building,
    Layers,
    Info,
    Mail,
    Users,
    Calendar,
    Clock,
} from 'lucide-react';

const Sidebar = ({ locationInfo, isOpen, toggleSidebar }) => {
    const renderInfoItem = (icon, label, value) => {
        if (!value) return null;
        return (
            <div className="info-item">
                {icon}
                <div>
                    <span className="info-label">{label}</span>
                    <span className="info-value">{value}</span>
                </div>
            </div>
        );
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button
                id="togglebtn"
                aria-label="toggle button"
                className="toggle-btn"
                onClick={toggleSidebar}
            >
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
            <div className="sidebar-content">
                {/* This div will always be rendered, solving the insertion issue */}
                {locationInfo ? (
                    <>
                        <h2 className="location-name">{locationInfo.name}</h2>
                        {locationInfo.category && (
                            <p className="location-category">{locationInfo.category}</p>
                        )}
                        <div className="location-details">
                            {renderInfoItem(<MapPin size={18} />, 'Campus', locationInfo.campus)}
                            {renderInfoItem(<Building size={18} />, 'Area', locationInfo.area)}
                            {renderInfoItem(
                                <Layers size={18} />,
                                'Level/Floor',
                                locationInfo.level,
                            )}
                            {renderInfoItem(<Mail size={18} />, 'Contact', locationInfo.contact)}
                            {renderInfoItem(<Users size={18} />, 'Capacity', locationInfo.capacity)}
                            {renderInfoItem(
                                <Calendar size={18} />,
                                'Booking',
                                locationInfo.booking,
                            )}
                            {renderInfoItem(
                                <Clock size={18} />,
                                'Opening Hours',
                                locationInfo.opening_hours,
                            )}
                        </div>
                        {locationInfo.description && (
                            <div className="description">
                                <h4>Description</h4>
                                <p>{locationInfo.description}</p>
                            </div>
                        )}
                        {locationInfo.amenities && locationInfo.amenities.length > 0 && (
                            <div className="amenities">
                                <h4>Amenities</h4>
                                <ul>
                                    {locationInfo.amenities.map((amenity, index) => (
                                        <li key={index}>{amenity}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <p className="no-location-info">Search a location to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
