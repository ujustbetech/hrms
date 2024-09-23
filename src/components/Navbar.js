import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLocalPostOffice } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegEdit } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";

const Navbar = (props) => {
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    return (
        <>
            <nav className={props.expand ? 'm-navbar expand' : 'm-navbar unexpand'}>
                <ul>
                       
                <li>
                        <Link to={`/admin-panel`}>
                            <span className="icons"><FaRegUser /></span>
                            <span className="linklabel">Users<span className="space"></span>List</span>
                            
                        </Link>
                    </li>
                    <li>
                        <Link to={`/leave-requests`}>
                            <span className="icons"><MdLocalPostOffice /></span>
                            <span className="linklabel">Leave<span className="space"></span>Requests</span>
                            
                        </Link>
                    </li>
                
                    <li>
                        <Link to={`/manage-slogans`}>
                            <span className="icons"><FaRegEdit /></span>
                            <span className="linklabel">Manage<span className="space"></span>Slogan</span>
                            
                        </Link>
                    </li>
                    <li>
                    <Link to={`/add-slogan`}>
                            <span className="icons"><MdOutlineNoteAdd /></span>
                            <span className="linklabel">Add<span className="space"></span>Slogan</span>
                            
                        </Link>
</li>
                    <li>
                        <Link to={`/update-announcement`}>
                            <span className="icons"><TfiAnnouncement /></span>
                            <span className="linklabel">New<span className="space"></span>Announcemet</span>
                            
                        </Link>
                    </li>
                    <li>
                        <Link to={`/uploadpdf`}>
                            <span className="icons"><IoCloudUploadOutline /></span>
                            <span className="linklabel">Update<span className="space"></span>Policy</span>
                            
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;
