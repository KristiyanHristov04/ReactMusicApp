import { supabase } from "../supabase";

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
    const artistImageUrl = supabase.storage
        .from('song-files')
        .getPublicUrl(path)
        .data.publicUrl;

    return artistImageUrl;
}

export const createArtist = async (name, biography, artistImageUrl, fileName, userId) => {
    const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .insert([
            {
                name: name,
                artist_image_url: artistImageUrl,
                biography: biography,
                file_name: fileName,
                user_id: userId
            }
        ])
        .select();

    if (artistError) {
        throw new Error(artistError.message);
    }
}



