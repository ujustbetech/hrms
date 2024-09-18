import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use this for navigation
import { BiLogOutCircle } from 'react-icons/bi';
import Swal from 'sweetalert2';



const Header = () => {
    const navigate = useNavigate(); // Initialize navigation hook

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout!',
            text: "Are you sure you want to logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'middle',
                    icon: 'success',
                    title: 'Logged out successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    localStorage.removeItem("ucoreadmin");
                    navigate("/"); // Use navigate for redirection
                });
            }
        });
    }

    return (
        <header className="wrapper m-header">
            <div className="headerLeft">
                {/* Add content or logo here */}
            </div>
            <div className="headerRight">
                <button onClick={handleLogout}>
                    <span className='icon-rotate-90'><BiLogOutCircle /></span>Logout
                </button>
            </div>
        </header>
    );
}

export default Header;
