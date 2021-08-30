import React from 'react';

function getScore(string, keywords, searchArrayIndex, options) {
    const keywordsArray = keywords.split(" ");
    var count = {
        index: searchArrayIndex,
        charCount: 0,
        wordCount: 0
    };
    keywordsArray.forEach(keyword => {
        for (let keywordChar of keyword) {
            for (let [index, stringChar] of string.split("").entries()) {
                // TODO add options for caseSensitive search
                if (keyword.length > 1 && string.substring(index, index + keyword.length).toLowerCase() === keyword.toLowerCase()) {
                    count.wordCount = count.wordCount + 1;
                } else {
                    if (stringChar.toLowerCase() === keywordChar.toLowerCase()) {
                        count.charCount = count.charCount + 1;
                    }
                }


            }
        }
    });

    return count;
}

function orderList(scoreArray, searchArray) {
    scoreArray.sort(function (a, b) {
        if (a.wordCount > b.wordCount) {
            return -1;
        }
        if (a.wordCount < b.wordCount) {
            return 1;
        }

        if (a.charCount > b.charCount) {
            return -1;
        }
        if (a.charCount < b.charCount) {
            return 1;
        }

        return 0;
    });

    return searchArray.map((searchObj, index) => {
        return searchArray[scoreArray[index].index];
    });
}

function fuzzySearch(searchArray, keywords) {
    let options = {
        caseSensitive: true,
        highlight: true,
        exactSearch: true, // if true, only results with the exact keyword will be returned. If false, results that contains some of the characters from the query will be returned also.
        keys: []
    };
    let scoreArray = [];
    searchArray.forEach((searchItem, index) => {
        scoreArray.push(getScore(searchItem.title, keywords, index));
    });
    searchArray = orderList(scoreArray, searchArray);


    const filtered = searchArray.filter((searchItem, index) => {
        if (options.exactSearch && keywords.length > 1) {
            if (scoreArray[index].wordCount > 0) {
                return true;
            }

        } else {
            if (scoreArray[index].charCount > 0) {
                return true;
            }
        }
        return false;
    });

    if (options.highlight) {
        filtered.forEach((searchItem, index) => {
            filtered[index].title = highlightSearch(searchItem.title, keywords);
        });
    }

    return filtered;
}


function highlightSearch(title, query) {
    if (!query) {
        return title;
    }
    let aux = "(";
    let keywordsArray = query.split(" ");
    keywordsArray = keywordsArray.filter(function (el) {
        return el !== "";
    });
    keywordsArray.forEach(keyword => {
        aux = aux + '' + keyword + '|'
    });
    // This removes the last unnecessary | char
    aux = aux.slice(0, -1) + ")";
    let regex = new RegExp(aux, 'gim');

    let titleArray = title.split(regex);

    keywordsArray.forEach(keyword => {
        for (let i = 0; i < titleArray.length; i++) {
            if (typeof titleArray[i] === 'string' && titleArray[i].toUpperCase() === keyword.toUpperCase()) {
                titleArray[i] = (
                    <span key={i} className='Article-title-highlight'>
                        {titleArray[i]}
                    </span>
                );
            }
        }
    });
    return titleArray;
}

export default fuzzySearch;