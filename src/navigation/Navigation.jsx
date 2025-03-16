import styles from './Navigation.module.css'
import { CiSearch } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosMusicalNotes } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineLibraryMusic } from "react-icons/md";
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';


export default function Navigation({ showSearchBar, setSongs, favouriteSongsIds }) {

    const [search, setSearch] = useState('');
    const [user, setUser] = useContext(AuthContext);
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
        navigate('/');
        console.log('Logged out');
    }

    return (
        <header>
            <nav>
                <div>
                    {showSearchBar && <span id={styles["search-icon"]}><CiSearch /></span>}
                    {showSearchBar && <input onChange={changeHandlerSearch} type="text" placeholder="Search for your favourite song or artist" value={search} />}
                </div>


                <div id={styles['right-side-container']}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles['active-link'] : ''}>Explore <MdOutlineLibraryMusic style={{ verticalAlign: 'middle' }} /></NavLink>
                    <NavLink to="/add-song" className={({ isActive }) => isActive ? styles['active-link'] : ''}>Add Song <IoIosMusicalNotes style={{ verticalAlign: 'middle' }} /></NavLink>
                    <NavLink to="/favourite-songs" className={({ isActive }) => isActive ? styles['active-link'] : ''}>Favourites <FaRegHeart style={{ verticalAlign: 'middle' }} /></NavLink>
                    <span>|</span>
                    {!user.id &&
                        <>
                            <NavLink to="/signup">Sign up</NavLink>
                            <NavLink id={styles['login-btn']} to="/login">Login</NavLink>
                        </>
                    }
                    {user.id && <NavLink onClick={logout} to="/">Logout</NavLink>}
                </div>
            </nav>
        </header>
    );
}