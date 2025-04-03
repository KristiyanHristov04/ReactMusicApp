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

    return songInformation;
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
