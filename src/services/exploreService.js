import { supabase } from "../supabase";

export const getSongs = async (searchTerm, from, to) => {
    const { data: songsInformation, error: errorSongsInformation } = await supabase
        .from('songs')
        .select(`
            id,
            name,
            song_image_url,
            song_url,
            songs_artists (
                artists (
                    id,
                    name,
                    artist_image_url
                )
            )
        `)
        .or(`name.ilike.%${searchTerm}%`)
        .range(from, to)
        .order('id', { ascending: false });

    if (errorSongsInformation) {
        throw new Error(errorSongsInformation.message);
    }

    const songs = songsInformation.map(song => ({
        id: song.id,
        name: song.name,
        song_image_url: song.song_image_url,
        song_url: song.song_url,
        artists: song.songs_artists.map(artist => artist.artists)
    }));

    return songs;
}

export const getTotalPages = async (searchTerm, songsPerPage) => {
    const { data: totalPages, error: errorTotalPages } = await supabase
        .from('songs')
        .select('id', { count: 'exact' })
        .or(`name.ilike.%${searchTerm}%`);

    if (errorTotalPages) {
        throw new Error(errorTotalPages.message);
    }

    const totalPagesCount = Math.ceil(totalPages.length / songsPerPage);

    return totalPagesCount;
}