import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from "aws-amplify";
import { IconContext } from 'react-icons';
import '../Styles/Subbar.css'
import '../Styles/Navbar.css';
import { SidebarData } from './SidebarData';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { FaUserNinja } from 'react-icons/fa'
import { useForm } from 'antd/lib/form/Form';

function Subbar() {

    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    const [USER_ID, setUSER_ID] = useState("");

    async function checkUser() {
        let user = await Auth.currentAuthenticatedUser();
        setUSER_ID(user.attributes.email)
    }
    checkUser()

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className='navbar'>
                    <FaIcons.FaBars type="button" size={35} onClick={showSidebar} />
                </div >

                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <div className='nav-menu-items' onClick={showSidebar}>

                        <div className='navbar-toggle minibar' style={{ display: "block" }}>
                            {/* <Link to='#' className='menu-bars' style={{ margin: "auto" }} > */}
                            <AiIcons.AiOutlineClose type="button" className="closeBar" size={50} />

                            <Link to="/profile">
                                <FaUserNinja size={50} style={{ color: "white" }} className="miniNinja" /></Link>

                            <p className="ninjaUser">{USER_ID}</p>

                        </div>

                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </div>
                </nav>
            </IconContext.Provider >
        </>
    );
}

export default Subbar;
