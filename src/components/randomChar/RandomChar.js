import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    };

    errMessage = null;
    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    };

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    };

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    };

    onError = (err) => {
        this.errMessage = err.message;
        this.setState({
            loading: false,
            error: true
        });
    };

    updateChar = () => {
        const id = Math.floor(Math.random() * 20) + 1;
        this.onCharLoading();
        this.marvelService.getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    };

    render() {
        const { char, loading, error } = this.state;

        return (
            <div className="randomchar">
                {loading ?
                    <Spinner />
                    : error ?
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ErrorMessage />
                            <span style={{ color: 'red', fontSize: '15px', textAlign: 'center' }}>{this.errMessage}</span>
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
                        onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div >
        );
    };
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
            // onError={(e) => {
            //     if (name) {
            //         const imgSrcFileName = name.toLowerCase().replace(/\s+/g, '-');
            //         const imgSrc = `${process.env.PUBLIC_URL}/img/${imgSrcFileName}.jpg`;
            //         if (!e.target.src.includes(imgSrc)) { // защита от зацикливания, если imgSrc не загрузилась с первого раза
            //             e.target.src = imgSrc;
            //         };
            //     };
            // }}
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