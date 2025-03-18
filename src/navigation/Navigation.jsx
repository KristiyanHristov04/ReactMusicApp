import styles from './Navigation.module.css'
import { CiSearch } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosMusicalNotes } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { HiOutlineUserAdd } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';


export default function Navigation({
    showSearchBar,
    setSongs,
    favouriteSongsIds
}) {

    const [search, setSearch] = useState('');
    const [user, setUser] = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const changeHandlerSearch = async (e) => {
        const value = e.currentTarget.value;
        console.log(value);
        setSearch(value);

        if (favouriteSongsIds) {
            console.log('favouriteSongsIds songs');
            console.log(favouriteSongsIds);
            const { data, error } = await supabase.from('songs')
                .select()
                .or(`name.ilike.%${value}%, artist.ilike.%${value}%`)
                .in('id', favouriteSongsIds)
                .order('id', { ascending: false });

            if (error) {
                console.error(error.message);
                return;
            }

            setSongs(data);
        } else {
            const { data, error } = await supabase.from('songs')
                .select()
                .or(`name.ilike.%${value}%, artist.ilike.%${value}%`)
                .order('id', { ascending: false });

            if (error) {
                console.error(error.message);
                return;
            }

            setSongs(data);
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error.message);
            return;
        }

        setUser({});
        setMobileMenuOpen(false);
        navigate('/');
        console.log('Logged out');
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const handleNavLinkClick = () => {
        setMobileMenuOpen(false);
    }

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
                            placeholder="Search for songs or artists"
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
                        to="/add-song"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <IoIosMusicalNotes />
                        <span>Add Song</span>
                    </NavLink>

                    <NavLink
                        to="/favourite-songs"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <FaRegHeart />
                        <span>Favourites</span>
                    </NavLink>

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