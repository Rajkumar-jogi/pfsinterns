import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossedBones } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import "./index.css";

const Header = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    const onClickLogin = () => {
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">QuizApp</Link>
            </div>
            {isActive && (
                <nav className="mobile-nav">
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/quizzes">Quizzes</Link></li>
                        <li><Link to="/dashboard">Admin</Link></li>
                    </ul>
                    <button type="button" className="mobile-logout-btn" onClick={onClickLogin}>
                        Login as Admin
                    </button>
                </nav>
            )}
            <nav className='desktop-nav'>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/quizzes">Quizzes</Link></li>
                    <li><Link to="/dashboard">Admin</Link></li>
                </ul>
            </nav>
            <button type="button" className="desktop-logout-btn" onClick={onClickLogin}>
                Login as Admin
            </button>
            <button className="menu-icon" onClick={toggleMenu}>
                {isActive ? <GiCrossedBones size={20} /> : <GiHamburgerMenu size={20} />}
            </button>
        </header>
    );
}

export default Header;
