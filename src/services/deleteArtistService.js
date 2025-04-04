import { supabase } from '../supabase';

export const getArtistInformation = async (artistId) => {
    const { data: artistInformation, error: errorArtistInformation } = await supabase.from('artists')
        .select()
        .eq('id', artistId);

    if (errorArtistInformation) {
        throw new Error(errorArtistInformation.message);
    }

    return artistInformation;
}

export const getSongsByArtist = async (artistId) => {
    const { data: songsByDeletedArtist, error: errorSongsByDeletedArtist } = await supabase.from('songs_artists')
        .select('song_id')
        .eq('artist_id', artistId);

    if (errorSongsByDeletedArtist) {
        throw new Error(errorSongsByDeletedArtist.message);
    }

    return songsByDeletedArtist;
}

export const deleteSongsByArtist = async (songsByArtist) => {
    const { error: deleteSongsByDeletedArtistError } = await supabase.from('songs')
        .delete()
        .in('id', songsByArtist.map(song => song.song_id))
        .select();

    if (deleteSongsByDeletedArtistError) {
        throw new Error(deleteSongsByDeletedArtistError.message);
    }
}

export const deleteArtist = async (artistId) => {
    const { error: errorArtistDelete } = await supabase.from('artists')
        .delete()
        .eq('id', artistId)
        .select();

    if (errorArtistDelete) {
        throw new Error(errorArtistDelete.message);
    }
}

export const deleteArtistImage = async (fileName) => {
    const { error: deleteArtistFileError } = await supabase.storage
        .from('song-files')
        .remove([`artist-images/${fileName}`]);

    if (deleteArtistFileError) {
        throw new Error(deleteArtistFileError.message);
    }
}
