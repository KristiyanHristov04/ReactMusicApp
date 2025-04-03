import { supabase } from "../supabase";

export const getArtistsForSelect = async () => {
    const { data: getArtistsData, error: getArtistsError } = await supabase
        .from('artists')
        .select('id, name')
        .order('name', { ascending: true });

    if (getArtistsError) {
        throw new Error(getArtistsError.message);
    }

    return getArtistsData.map(artist => ({
        value: artist.id,
        label: artist.name
    }));
}

export const getSongInformation = async (songId) => {
    const { data: songInformation, error: errorSongInformation } = await supabase
        .from('songs')
        .select(`
            id,
            name,
            user_id,
            lyrics,
            file_name,
            songs_artists (
                artists (
                    id,
                    name,
                    artist_image_url
                )
            )
        `)
        .eq('id', songId);

    if (errorSongInformation) {
        throw new Error(errorSongInformation.message);
    }

    return songInformation;
}
