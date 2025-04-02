import * as Yup from 'yup';

export const CreateSchema = Yup.object().shape({
    name: Yup.string().required('Please enter song name.'),
    lyrics: Yup.string().required('Please enter song lyrics.'),
    song: Yup.mixed().required('Please upload audio of the song.'),
    songImage: Yup.mixed().required('Please upload image of the song.'),
    selectedArtists: Yup.array().min(1, 'Please select at least one artist.').required('Please select at least one artist.'),
});