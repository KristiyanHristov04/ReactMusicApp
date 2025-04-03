import { supabase } from "../supabase";

export const getSong = async (id) => {

    const { data: songInformation, error: errorSongInformation } = await supabase
        .from('songs')
        .select(`
               id,
               name,
               song_image_url,
               song_url,
               total_listenings,
               user_id,
               lyrics,
               songs_artists (
                   artists (
                       id,
                       name,
                       artist_image_url
                   )
               )
           `)
        .eq('id', id);

    if (errorSongInformation) {
        throw new Error(errorSongInformation.message);
    }

    if (songInformation.length === 0) {
        return [];
    }

    const song = {
        id: songInformation[0].id,
        name: songInformation[0].name,
        song_image_url: songInformation[0].song_image_url,
        song_url: songInformation[0].song_url,
        artists: songInformation[0].songs_artists.map(artist => ({
            id: artist.artists.id,
            name: artist.artists.name
        })),
        artist_image_url: songInformation[0].songs_artists[0].artists.artist_image_url,
        total_listenings: songInformation[0].total_listenings,
        user_id: songInformation[0].user_id,
        lyrics: songInformation[0].lyrics
    };

    return song;
}

export const getTopSongs = async () => {
    const { data: topSongs, error: topError } = await supabase
        .from('songs')
        .select('id, total_listenings')
        .order('total_listenings', { ascending: false })
        .limit(3);

    if (topError) {
        throw new Error(topError.message);
    }

    return topSongs;
}
