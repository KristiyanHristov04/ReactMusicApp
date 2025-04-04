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

export const addArtistImage = async (fileName, artistImage) => {
    const { data: artistImageData, error: artistImageError } = await supabase.storage
        .from('song-files')
        .upload(`artist-images/${fileName}`, artistImage);

    if (artistImageError) {
        throw new Error(artistImageError.message);
    }

    return artistImageData;
}

export const getArtistImageUrl = (path) => {
    const fileUrl = supabase.storage
        .from('song-files')
        .getPublicUrl(path)
        .data.publicUrl;

    return fileUrl;
}

export const editArtist = async (artistId, name, biography, artistImageUrl, userId, fileName) => {
    const { data: editedArtistData, error: editedArtistError } = await supabase
        .from('artists')
        .update(
            {
                name: name,
                biography: biography,
                artist_image_url: artistImageUrl,
                user_id: userId,
                file_name: fileName
            }
        )
        .eq('id', artistId);

    if (editedArtistError) {
        throw new Error(editedArtistError.message);
    }

    return editedArtistData;
}

export const deleteArtistImage = async (fileName) => {
    const { error: filesDeleteError } = await supabase.storage
        .from('song-files')
        .remove([`artist-images/${fileName}`])

    if (filesDeleteError) {
        throw new Error(filesDeleteError.message);
    }
}
