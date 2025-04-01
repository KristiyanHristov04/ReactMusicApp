import styles from './Navigation.module.css'
import { CiSearch } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosMusicalNotes } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoAlbumsOutline } from "react-icons/io5";
import { GiMicrophone } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";

import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';

export default function Navigation({
    showSearchBar,
    searchPlaceHolder = 'Search for songs',
    setSearchParent,
    setPage
}) {

    const [search, setSearch] = useState('');
    const [user, setUser] = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const changeHandlerSearch = async (e) => {
        const value = e.currentTarget.value;
        console.log(value);
        setSearch(value);
        setSearchParent(value);
        setPage(1);
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(error.message);
            }

            setUser({});
            setMobileMenuOpen(false);
            navigate('/login', { state: { message: "You logged out successfully!", variant: "success" } });
        } catch (e) {
            console.error(e.message);
            setUser({});
            setMobileMenuOpen(false);
            navigate('/login', { state: { message: "You logged out successfully!", variant: "success" } });
        }
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const handleNavLinkClick = () => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }

    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownOpen(!dropdownOpen);
    }

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest(`.${styles.dropdown}`)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <header className={styles.header}>
            <div onClick={() => navigate('/')} className={styles.logo}>
                <IoIosMusicalNotes />
                <span>MusicApp</span>
            </div>

            <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navActive : ''}`}>
                {showSearchBar && (
                    <div className={styles.searchContainer}>
                        <span className={styles.searchIcon}><CiSearch /></span>
                        <input
                            onChange={changeHandlerSearch}
                            type="text"
                            placeholder={searchPlaceHolder}
                            value={search}
                            className={styles.searchInput}
                        />
                    </div>
                )}

                <div className={styles.navLinks}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <MdOutlineLibraryMusic />
                        <span>Explore</span>
                    </NavLink>

                    <NavLink
                        to="/artists"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <GiMicrophone />
                        <span>Artists</span>
                    </NavLink>

                    <NavLink
                        to="/add-song"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <IoIosMusicalNotes />
                        <span>Add Song</span>
                    </NavLink>

                    <NavLink
                        to="/add-artist"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <GiMicrophone />
                        <span>Add Artist</span>
                    </NavLink>

                    <div className={styles.dropdown}>
                        <button 
                            className={`${styles.dropdownButton} ${dropdownOpen ? styles.active : ''}`}
                            onClick={toggleDropdown}
                        >
                            <FaUser />
                            <span>My Collections</span>
                            <IoChevronDownOutline className={dropdownOpen ? styles.rotated : ''} />
                        </button>
                        <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.show : ''}`}>
                            <NavLink
                                to="/favourite-songs"
                                className={({ isActive }) => isActive ? styles.activeLink : ''}
                                onClick={handleNavLinkClick}
                            >
                                <div className={styles["dropdown-items"]}>
                                    <FaRegHeart />
                                    <span>Favourites</span>
                                </div>
                            </NavLink>
                            <NavLink
                                to="/my-songs"
                                onClick={handleNavLinkClick}
                                className={({ isActive }) => isActive ? styles.activeLink : ''}
                            >
                                <div className={styles["dropdown-items"]}>
                                    <IoAlbumsOutline />
                                    <span>My Songs</span>
                                </div>
                            </NavLink>
                            <NavLink
                                to="/my-artists"
                                onClick={handleNavLinkClick}
                                className={({ isActive }) => isActive ? styles.activeLink : ''}
                            >
                                <div className={styles["dropdown-items"]}>
                                    <GiMicrophone />
                                    <span>My Artists</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {!user.id ? (
                        <div className={styles.authLinks}>
                            <NavLink
                                to="/signup"
                                className={styles.signupBtn}
                                onClick={handleNavLinkClick}
                            >
                                <HiOutlineUserAdd />
                                <span>Sign up</span>
                            </NavLink>

                            <NavLink
                                to="/login"
                                className={styles.loginBtn}
                                onClick={handleNavLinkClick}
                            >
                                <RiLoginBoxLine />
                                <span>Login</span>
                            </NavLink>
                        </div>
                    ) : (
                        <button
                            onClick={logout}
                            className={styles.logoutBtn}
                        >
                            <RiLogoutBoxLine />
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </nav>

            <button className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <IoClose /> : <HiMenu />}
            </button>
        </header>
    );
}