import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocalPostOffice } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegEdit } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { MdEventAvailable, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";


const Navbar = (props) => {
    
    
    return (
        <>
            {props.loading ? (  // Check if loading prop is true
               <div className='loader'> <span className="loader2"></span> </div>
            ) : (
                <nav className={props.expand ? 'm-navbar expand' : 'm-navbar unexpand'}>
                    <ul>
                        {/*  Event */}
                        <li>
                        <Link to={`/admin-panel`}>
                            <span className="icons"><FaRegUser /></span>
                            <span className="linklabel">Users<span className="space"></span>List</span>
                            
                        </Link>
                    </li>
                    
                        <li>
                            <Link href="/admin/event/addEvent">
                                <span className="icons"><MdOutlineNoteAdd /></span>
                                <span className="linklabel">Slogans</span>
                                <span className="submenuIcon"><MdOutlineKeyboardArrowDown /></span>
                            </Link>
                            <ul>
                               <li><Link to={`/add-slogan`}>Add Slogan</Link></li>
                                <li><Link to={`/manage-slogans`}>Manage Slogan</Link></li>
                            </ul>
                        </li>
                 
                        {/* Users */}
                        <li>
                            <Link href="/admin/event/userlist">
                                <span className="icons"><TfiAnnouncement /></span>
                                <span className="linklabel">Announcement</span>
                                <span className="submenuIcon"><MdOutlineKeyboardArrowDown /></span>
                            </Link>
                            <ul>
                                <li><Link to={`/update-announcement`}>New Announcement</Link></li>
                                <li><Link to={`/manageann`}>Manage Announcement</Link></li>
                            </ul>
                        </li>
                        <li>
                            <Link href="/admin/event/userlist">
                                <span className="icons"><IoCloudUploadOutline /></span>
                                <span className="linklabel">Policy</span>
                                <span className="submenuIcon"><MdOutlineKeyboardArrowDown /></span>
                            </Link>
                            <ul>
                                <li><Link to={`/uploadpdf`}>New Policy</Link></li>
                                <li><Link to={`/managepdf`}>Manage Policy</Link></li>
                            </ul>
                        </li>
                       
                        <li>
                        <Link to={`/leave-requests`}>
                            <span className="icons"><MdLocalPostOffice /></span>
                            <span className="linklabel">Leave<span className="space"></span>Requests</span>
                            
                        </Link>
                    </li>
                       
                    </ul>
                </nav>
            )}
        </>
    );
}


export default Navbar;
