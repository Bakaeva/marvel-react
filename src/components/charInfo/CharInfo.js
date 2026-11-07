import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    let errMessage = null;
    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);


    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        };

        setLoading(true);
        marvelService.getCharacter(charId)
            .then((char) => {
                setChar(char);
                setLoading(false);
            })
            .catch((err) => {
                errMessage = err.message;
                setError(true);
                setLoading(false);
            });
    };

    return (
        <div className="char__info" >
            {loading ?
                <Spinner />
                : error ?
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ErrorMessage />
                        <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{errMessage}</span>
                    </div>
                    : char ?
                        <View char={char} />
                        : <Skeleton />
            }
        </div>
    );
};

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
        ? { 'objectFit': 'contain' }
        : { 'objectFit': 'cover' };

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0
                    ? 'There is no comics with this character'
                    : comics.map((item, index) => {
                        // eslint-disable-next-line
                        if (index > 9) return;
                        return (
                            <li className="char__comics-item" key={index}>
                                {item}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: PropTypes.number
};

export default CharInfo;