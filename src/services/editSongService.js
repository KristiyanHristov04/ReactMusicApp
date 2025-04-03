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

export const addSongAudio = async (fileName, song) => {
    const { data: songData, error: songError } = await supabase.storage
        .from('song-files')
        .upload(`song-audios/${fileName}`, song);

    if (songError) {
        throw new Error(songError.message);
    }

    return songData;
}

export const addSongImage = async (fileName, songImage) => {
    const { data: songImageData, error: songImageError } = await supabase.storage
        .from('song-files')
        .upload(`song-images/${fileName}`, songImage);

    if (songImageError) {
        throw new Error(songImageError.message);
    }

    return songImageData;
}

export const getSongFileUrl = (path) => {
    const fileUrl = supabase.storage
        .from('song-files')
        .getPublicUrl(path)
        .data.publicUrl;

    return fileUrl;
}

export const editSong = async (songId, name, lyrics, songUrl, songImageUrl, userId, fileName) => {
    const { data: editedSongData, error: editedSongError } = await supabase
        .from('songs')
        .update(
            {
                name: name,
                lyrics: lyrics,
                song_url: songUrl,
                song_image_url: songImageUrl,
                user_id: userId,
                file_name: fileName
            }
        )
        .eq('id', songId);

    if (editedSongError) {
        throw new Error(editedSongError.message);
    }

    return editedSongData;
}

export const deleteSongAudioAndImage = async (fileName) => {
    const { error: filesDeleteError } = await supabase.storage
        .from('song-files')
        .remove([`song-audios/${fileName}`,
        `song-images/${fileName}`]);

    if (filesDeleteError) {
        throw new Error(filesDeleteError.message);
    }
}

export const deleteSongArtists = async (songId) => {
    const { error: errorSongsArtistsDelete } = await supabase
        .from('songs_artists')
        .delete()
        .eq('song_id', songId);

    if (errorSongsArtistsDelete) {
        throw new Error(errorSongsArtistsDelete.message);
    }
}

export const addSongArtists = async (songId, artists) => {
    const { error: errorSongsArtistsInsert } = await supabase
        .from('songs_artists')
        .insert(artists.map(artist => ({
            song_id: songId,
            artist_id: artist.value
        })));

    if (errorSongsArtistsInsert) {
        throw new Error(errorSongsArtistsInsert.message);
    }
}
