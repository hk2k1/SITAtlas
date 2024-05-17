import React from 'react';

const BeforeLogin: React.FC = () => {
    return (
        <div>
            <p>
                <b>Welcome to the dashboard!</b>
                {' SITAtlas Login Page. '}
                <br />
                {' Users will need to '}
                <a href={`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/login`}>
                    this login page instead
                </a>
            </p>
        </div>
    );
};

export default BeforeLogin;
