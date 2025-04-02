import * as Yup from 'yup';

export const CreateSchema = Yup.object().shape({
    name: Yup.string().required('Please enter artist name.'),
    artistImage: Yup.mixed().required('Please upload image of the artist.'),
    biography: Yup.string().required('Please enter artist biography.'),
});