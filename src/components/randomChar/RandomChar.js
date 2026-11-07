import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    let errMessage = null;
    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, []);

    const updateChar = () => {
        const id = Math.floor(Math.random() * 20) + 1;
        setLoading(true);
        marvelService.getCharacter(id)
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
        <div className="randomchar">
            {loading ?
                <Spinner />
                : error ?
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ErrorMessage />
                        <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{errMessage}</span>
                    </div>
                    : <View char={char} />
            }
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                    onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div >
    );
};

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;
    const descriptionText = description ? description : 'Описание отсутствует';
    let imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
        ? { 'objectFit': 'contain' }
        : { 'objectFit': 'cover' };
    return (
        <div className="randomchar__block">
            <img
                src={thumbnail}
                alt={`Random character`}
                className="randomchar__img"
                style={imgStyle}
            />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descriptionText}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RandomChar;