'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Italic } from 'lucide-react';

const Sidebar = ({ locationInfo, isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
            <div className="sidebar-content">
                <h2>{locationInfo?.name}</h2>
                <h4>
                    <i>{locationInfo?.category}</i>
                </h4>
                <p>
                    <strong>Campus:</strong> {locationInfo?.campus}
                </p>
                <p>
                    <strong>Area:</strong> {locationInfo?.area}
                </p>
                <p>
                    <strong>Level/Floor:</strong> {locationInfo?.level}
                </p>
                <p>
                    <strong>Description:</strong> {locationInfo?.description}
                </p>
                <div>contact: {locationInfo?.contact}</div>
                <div>capacity: {locationInfo?.capacity}</div>
                <div>booking: {locationInfo?.booking}</div>
                <div>opening hours: {locationInfo?.opening_hours}</div>
                <h3>Amenities</h3>
                <ul>
                    {locationInfo?.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
