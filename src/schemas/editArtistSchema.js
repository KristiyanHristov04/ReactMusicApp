import * as Yup from 'yup';

export const EditSchema = Yup.object().shape({
    name: Yup.string().required('Please enter artist name.'),
    biography: Yup.string().required('Please enter artist biography.'),
    artistImage: Yup.mixed().required('Please upload image of the artist.'),
});