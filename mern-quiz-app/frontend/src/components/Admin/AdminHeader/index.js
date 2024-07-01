import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import {Link, useNavigate} from 'react-router-dom'

import Cookies from "js-cookie"

import { GiCrossedBones } from "react-icons/gi";

import "./index.css";

const AdminHeader = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsActive(!isActive);
    };
   
    const onClickLogout = () => {
       console.log("clicked on logout button...")
       Cookies.remove('token')
       navigate('/login')
    }
    

    return (
        <header className="admin-header">
            <div className="admin-logo">
                <Link to="/dashboard">QuizApp</Link>
            </div>
            {
                isActive ?
                <nav className="admin-mobile-nav">
                    <ul className="admin-nav-links">  
                        <li><Link to="/dashboard">DashBoard</Link></li> 
                        <li><Link to="/my-profile">My Profile</Link></li> 
                    </ul>
                <button type="button" className="admin-button admin-mobile-logout-btn" onClick={onClickLogout}>Logout</button>
                </nav> :  
                <nav className='admin-desktop-nav'>
                    <ul className="admin-nav-links">
                        <li><Link to="/dashboard">DashBoard</Link></li> 
                        <li><Link to="/my-profile">My Profile</Link></li> 
                    </ul>
                </nav>
            }
            
            <button type="button" className="admin-button desktop-logout-btn" onClick={onClickLogout}>Logout</button>
            <button className="admin-menu-icon" onClick={toggleMenu}>
               {isActive ? <GiCrossedBones size={20}/> : <GiHamburgerMenu size={20} />} 
            </button>
        </header>
    );
}

export default AdminHeader;
