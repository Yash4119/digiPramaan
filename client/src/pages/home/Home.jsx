import React, { useState, useEffect } from 'react';
import './home.scss';
import { Link } from 'react-router-dom';

export default function Home() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        // Adjust these values to control the movement sensitivity
        // const movementX = clientX * 0.01;
        // const movementY = clientY * 0.01;
        setPosition({ x: clientX, y: clientY });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    return (
        <div className="home page">
            <div className="left-content">
                <div className="heading">
                    Certificates<br></br>
                    Simplified.
                </div>
                <div className="sub-text">
                    One stop solution for digital certificate verification and issuance
                </div>
                <div className="button-wrapper">
                    <button>SIGN UP</button>
                    <Link to={'/verify'}>
                        <button>VERIFY</button>
                    </Link>
                </div>
            </div>
            <div className="right-images">
                    <img className="img-b" src="images/backdrop.png" alt="" 
                        style={{ transform: `translate(${position.x * 0.05}px, ${position.y * 0.01}px) rotate(${position.y * 0.01 + 0}deg) scaleX(-1)`, opacity:'1' }}/>
                    <img className="img-m" src="images/main.webp" alt="" 
                        style={{ transform: `translate(${position.x * 0.08}px, ${position.y * 0.02}px) rotate(${position.y * -0.01 + 10}deg)`, opacity:'1'  }}/>
                    <img className="img-f" src="images/foreground.png" alt="" 
                        style={{ transform: `translate(${position.x * 0.1}px, ${position.y * 0.04}px) rotate(${position.y * 0.03 + 20}deg)`, opacity:'1'  }}/>
            </div>
        </div>
    )
}