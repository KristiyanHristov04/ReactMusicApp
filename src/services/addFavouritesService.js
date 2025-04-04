import { supabase } from "../supabase";

export const getSongs = async (searchTerm, paginatedIds) => {
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
        .in('id', paginatedIds);

    if (errorSongsInformation) {
        throw new Error(errorSongsInformation.message);
    }

    const songsData = songsInformation.map(song => ({
        id: song.id,
        name: song.name,
        song_image_url: song.song_image_url,
        song_url: song.song_url,
        artists: song.songs_artists.map(artist => artist.artists)
    }));

    songsData.sort((a, b) => {
        return paginatedIds.indexOf(a.id) - paginatedIds.indexOf(b.id);
    });

    return songsData;
}

export const getTotalPages = async (searchTerm, songIds, songsPerPage) => {
    const { data, error } = await supabase
        .from('songs')
        .select('id')
        .in('id', songIds)
        .or(`name.ilike.%${searchTerm}%`);

    if (error) {
        throw new Error(error.message);
    }

    const totalPagesCount = Math.ceil(data.length / songsPerPage);

    return totalPagesCount;
}
