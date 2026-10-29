import { Component } from 'react';
import MarvelService from "../../services/MarvelService";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar(); // TODO: вынести из конструктора
    };

    state = {
        char: {}
    };

    marvelService = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({ char });
    };

    updateChar = () => {
        const id = Math.floor(Math.random() * 20) + 1;
        this.marvelService.getCharacter(id)
            .then(this.onCharLoaded);
    };

    render() {
        const { char: { name, description, thumbnail, homepage, wiki } } = this.state;

        const descriptionText = description
            ? description
            : 'Описание отсутствует';

        return (
            <div className="randomchar">
                <div className="randomchar__block">
                    <img
                        src={thumbnail}
                        alt={`Random character`}
                        className="randomchar__img"
                        onError={(e) => {
                            if (name) {
                                const imgSrcFileName = name.toLowerCase().replace(/\s+/g, '-');
                                const imgSrc = `/img/${imgSrcFileName}.jpg`;
                                if (!e.target.src.includes(imgSrc)) { // защита от зацикливания, если imgSrc не загрузилась с первого раза
                                    e.target.src = imgSrc;
                                };
                            };
                        }}
                    />
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name || 'Загрузка...'}</p>
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
            </div>
        );
    };
};

export default RandomChar;