import { supabase } from "../supabase";

export const getSong = async (songId) => {
    const { data: songInformation, error: errorSongInformation } = await supabase.from('songs')
        .select()
        .eq('id', songId);

    if (errorSongInformation) {
        throw new Error(errorSongInformation.message);
    }

    return songInformation;
}

export const deleteSong = async (songId) => {
    const { error: errorSongsDelete } = await supabase.from('songs')
        .delete()
        .eq('id', songId);

    if (errorSongsDelete) {
        throw new Error(errorSongsDelete.message);
    }
}

export const deleteSongFiles = async (fileName) => {
    const { error: filesDeleteError } = await supabase.storage
        .from('song-files')
        .remove([`song-audios/${fileName}`,
        `song-images/${fileName}`]);

    if (filesDeleteError) {
        throw new Error(filesDeleteError.message);
    }
}
