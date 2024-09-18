import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLocalPostOffice } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegEdit } from "react-icons/fa";

const Navbar = (props) => {
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    return (
        <>
            <nav className={props.expand ? 'm-navbar expand' : 'm-navbar unexpand'}>
                <ul>
                    <li>
                        <Link to={`/leave-requests`}>
                            <span className="icons"><MdLocalPostOffice /></span>
                            <span className="linklabel">Leave<span className="space"></span>Requests</span>
                            
                        </Link>
                    </li>
                    {/* Add other navigation items similarly */}
                    <li>
                        <Link to={`/update-slogan`}>
                            <span className="icons"><FaRegEdit /></span>
                            <span className="linklabel">Slogan<span className="space"></span>Edit</span>
                            
                        </Link>
                    </li>

                    <li>
                        <Link to={`/update-announcement`}>
                            <span className="icons"><TfiAnnouncement /></span>
                            <span className="linklabel">New<span className="space"></span>Announcemet</span>
                            
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;
