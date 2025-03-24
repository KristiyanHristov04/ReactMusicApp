import styles from './Navigation.module.css'
import { CiSearch } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosMusicalNotes } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoAlbumsOutline } from "react-icons/io5";

import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';


export default function Navigation({
    showSearchBar,
    setSongs,
    favouriteSongsIds,
    isMine
}) {

    const [search, setSearch] = useState('');
    const [user, setUser] = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const changeHandlerSearch = async (e) => {
        const value = e.currentTarget.value;
        console.log(value);
        setSearch(value);

        try {
            if (favouriteSongsIds) {
                console.log('favouriteSongsIds songs');
                console.log(favouriteSongsIds);
                const { data, error } = await supabase.from('songs')
                    .select()
                    .or(`name.ilike.%${value}%, artist.ilike.%${value}%`)
                    .in('id', favouriteSongsIds)
                    .order('id', { ascending: false });

                if (error) {
                    throw new Error(error.message);
                }

                setSongs(data);
            } else if (isMine) {
                const { data, error } = await supabase.from('songs')
                    .select()
                    .eq('user_id', user.id)
                    .or(`name.ilike.%${value}%, artist.ilike.%${value}%`)
                    .order('id', { ascending: false });

                if (error) {
                    throw new Error(error.message);
                }

                setSongs(data);
            } else {
                const { data, error } = await supabase.from('songs')
                    .select()
                    .or(`name.ilike.%${value}%, artist.ilike.%${value}%`)
                    .order('id', { ascending: false });

                if (error) {
                    throw new Error(error.message);
                }

                setSongs(data);
            }
        } catch (e) {
            console.error(e.message);
        }

    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(error.message);
            }

            setUser({});
            setMobileMenuOpen(false);
            navigate('/');
        } catch (e) {
            console.error(e.message);
            setUser({});
            setMobileMenuOpen(false);
            navigate('/');
        }
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

                    <NavLink
                        to="/my-songs"
                        className={({ isActive }) => isActive ? styles.activeLink : ''}
                        onClick={handleNavLinkClick}
                    >
                        <IoAlbumsOutline />
                        <span>My Songs</span>
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