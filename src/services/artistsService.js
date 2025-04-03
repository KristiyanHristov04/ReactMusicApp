import { supabase } from "../supabase";

export const getArtists = async (searchTerm, from, to) => {
    const { data: artistsData, error: errorArtists } = await supabase
        .from('artists')
        .select(`
                id,
                name,
                artist_image_url,
                songs_artists (
                    songs (
                        total_listenings
                    )
                )
            `)
        .or(`name.ilike.%${searchTerm}%`)
        .range(from, to)
        .order('id', { ascending: false });

    if (errorArtists) {
        throw new Error(errorArtists.message);
    }

    const artistsWithTotalListenings = artistsData.map(artist => ({
        ...artist,
        total_listenings: artist.songs_artists.reduce((total, song) =>
            total + (song.songs?.total_listenings || 0), 0)
    }));

    return artistsWithTotalListenings;
}

export const getTotalPages = async (searchTerm, artistsPerPage) => {
    const { data: totalArtists, error: errorTotal } = await supabase
        .from('artists')
        .select('id', { count: 'exact' })
        .or(`name.ilike.%${searchTerm}%`);

    if (errorTotal) {
        throw new Error(errorTotal.message);
    }

    const totalPagesCount = Math.ceil(totalArtists.length / artistsPerPage);
    
    return totalPagesCount;
}