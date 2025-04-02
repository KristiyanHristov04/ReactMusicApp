export const customStyles = {
    control: (base, state) => ({
        ...base,
        background: '#3E3E3E',
        cursor: 'pointer',
        minHeight: '49px',
    }),
    menu: (base) => ({
        ...base,
        background: '#282828',
        border: '1px solid #3E3E3E',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#3E3E3E' : '#282828',
        color: '#fff',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#3E3E3E'
        }
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#1DB954',
        color: '#fff',
        borderRadius: '4px',
        padding: '2px 8px',
        margin: '2px',
        '& > div': {
            color: '#fff'
        }
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#fff',
        ':hover': {
            backgroundColor: '#dd4e4e',
            color: '#fff'
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: '#fff'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#B3B3B3'
    }),
    input: (base) => ({
        ...base,
        color: '#fff'
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: '#fff',
        '& svg': {
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
            fill: '#fff'
        },
        '& svg path': {
            fill: '#fff'
        }
    })
};