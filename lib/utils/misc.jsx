import React from 'react';

import Highlighter from 'react-highlight-words';

export function delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
}
export function getDeepValue(obj, path) {
    return path.split('.').reduce((out, key) => (out ? out[key] : undefined), obj);
}
export function clearSession(o) {
    const { appState, smartState } = o;
    const appStatePrefix = o.appStatePrefix || '';
    const smartStatePrefix = o.smartStatePrefix || '';
    const appStateSuffix = o.appStateSuffix || '';
    const smartStateSuffix = o.smartStateSuffix || '';
    const appSessionKey = `${appStatePrefix}${appState}${appStateSuffix}`;
    const smartSessionKey = `${smartStatePrefix}${smartState}${smartStateSuffix}`;
    sessionStorage.removeItem(appSessionKey);
    sessionStorage.removeItem(smartSessionKey);
}
export function queryStringParse(inp = null) {
    const result = {};
    const input = (inp || '').split('?').slice(-1)[0];
    const split1 = input.split('&');
    split1.forEach((chunks) => {
        const split2 = chunks.split('=');
        result[split2[0]] = split2[1];
    });
    return result;
}
export const paramsToQuery = (params = {}) => Object.keys(params).map((key) => {
    const keyLabel = key.split('___')[0];
    let value = params[key];
    if (Array.isArray(value)) {
        value = value.join(',');
    }
    return `${keyLabel}=${value}`;
}).join('&');
export const shouldUseZipkin = () => {
    const BUILD_ENV = __BUILD_ENV__;
    return (BUILD_ENV === 'local' || BUILD_ENV === 'dev' || BUILD_ENV === 'development' || BUILD_ENV === 'uat');
};
export const getZipkinEndpoint = () => `${__ZIPKIN__}${__Zipkin_API_V2__}`;
export const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));
export const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        const keys = Object.keys(source)
        const keysLength = keys.length

        for (let i = 0; i < keysLength; i += 1) {
            const key = keys[i]
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
};

export const performLogout = (props, auto = false) => {
    props.fhir_Reset();
    props.ui_SetLoggedOut();
    if (auto) {
        props.ui_SetLoggedOutAuto();
    }
    sessionStorage.clear();
    props.history.replace('/?logout=1');
}

export const splitSearch = (searchRaw = '') => {
    let flag = false;
    const searchMedium = searchRaw.split('').reduce((reduced, char) => {
        let newChar = char;
        if (char === '"' || char === "'") {
            flag = !flag
        }

        if (char === ' ') {
            newChar = flag ? ' ' : '+'
        }

        return `${reduced}${newChar}`
    }, '').replace(/"/g, '').replace(/'/g, '')

    // Search Well Done
    return searchMedium.split('+')
}

export const highlight = (inputStringRaw, searchArray = []) => {
    const inputString = `${inputStringRaw}`;

    return (
        <Highlighter
            highlightClassName="highlit"
            searchWords={searchArray}
            sanitize={(word) => (
                word
                    .replace(/ñ/g, 'n')

                    .replace(/á/g, 'a')
                    .replace(/ú/g, 'u')
                    .replace(/ó/g, 'o')
                    .replace(/é/g, 'e')
                    .replace(/í/g, 'i')

                    .replace(/à/g, 'a')
                    .replace(/ù/g, 'u')
                    .replace(/ò/g, 'o')
                    .replace(/è/g, 'e')
                    .replace(/ì/g, 'i')

                    .replace(/â/g, 'a')
                    .replace(/û/g, 'u')
                    .replace(/ô/g, 'o')
                    .replace(/ê/g, 'e')
                    .replace(/î/g, 'i')

                    .replace(/ä/g, 'a')
                    .replace(/ü/g, 'u')
                    .replace(/ö/g, 'o')
                    .replace(/ë/g, 'e')
                    .replace(/ï/g, 'i')
            )}
            autoEscape
            textToHighlight={inputString}
            highlightStyle={{
                padding: 1,
                margin: 1,
                background: '#a543b1',
                borderRadius: 5,
                color: '#FFF',
            }}
        />
    )
}

export const randomInteger = (maxNum, minNum = 0) => minNum + Math.round(Math.random() * (maxNum - minNum))

export const randomFloat = (maxNum, minNum = 0, decimalPlaces = 2) => {
    const pow = 10 ** decimalPlaces;
    return Math.round((minNum + Math.random() * (maxNum - minNum)) * pow) / pow;
}
