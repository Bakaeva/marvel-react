import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  //const _apiBase = 'https://marvel-server-zeta.vercel.app/';
  const _apiBase = ''; // в package.json добавлен proxy: "https://marvel-server-zeta.vercel.app", чтобы браузер не применял в запросах CORS
  const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
  const _baseOffset = 0;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description,
      thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
      homepage: character.urls[0].url,
      wiki: character.urls[1].url,
      comics: character.comics.items
    };
  };

  return { loading, error, getAllCharacters, getCharacter, clearError };
};

export default useMarvelService;