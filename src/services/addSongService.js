import { supabase } from "../supabase";

export const getArtists = async () => {
    const { data: getArtistsData, error: getArtistsError } = await supabase
        .from('artists')
        .select('id, name')
        .order('name', { ascending: true });

    if (getArtistsError) {
        throw new Error(getArtistsError.message);
    }

    const artists = getArtistsData.map(artist => ({
        value: artist.id,
        label: artist.name
    }));

    return artists;
}

export const addSongAudio = async (fileName, song) => {
    const { data: songData, error: songError } = await supabase.storage
        .from('song-files')
        .upload(`song-audios/${fileName}`, song);

    if (songError) {
        throw new Error(songError.message);
    }
    console.log(songData);
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

export const createSong = async (songName, lyrics, songUrl, songImageUrl, userId, fileName) => {
    const { data: createdSongData, error: createdSongError } = await supabase
        .from('songs')
        .insert([
            {
                name: songName,
                lyrics: lyrics,
                song_url: songUrl,
                song_image_url: songImageUrl,
                user_id: userId,
                file_name: fileName,
            }
        ])
        .select();

    if (createdSongError) {
        throw new Error(createdSongError.message);
    }

    return createdSongData;
}

export const addSongArtist = async (songId, artistId) => {
    const { error: artistError } = await supabase
        .from('songs_artists')
        .insert([
            {
                song_id: songId,
                artist_id: artistId
            }
        ]);

    if (artistError) {
        throw new Error(artistError.message);
    }
}
