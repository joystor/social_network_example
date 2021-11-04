//const urlBase = 'http://127.0.0.1:8000';

const readUrl = (url = '') => url;
    //url.startsWith('http://') || url.startsWith('https://') ? url : url; //`${urlBase}/${url}`

const getFetch = (url = '', headers = {}) => fetch(readUrl(url), {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
}).then((response) => response.json())

const postFetch = (url = '', body = {}, headers = {}) => fetch(readUrl(url), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
}).then((response) => response.json())

const putFetch = (url = '', body = {}, headers = {}) => fetch(readUrl(url), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
}).then((response) => response.json())

const delFetch = (url = '', headers = {}) => fetch(readUrl(url), {
    method: 'DELETE',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
}).then((response) => response.json())

const FetchClient = {
    get: getFetch,
    post: postFetch,
    put: putFetch,
    delete: delFetch
};