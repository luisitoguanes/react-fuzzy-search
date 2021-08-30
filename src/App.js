import React, { useState } from 'react';
import './App.css';
import fuzzySearch from './FuzzySearch'

function filterArticlesByQuery(query, articles) {
  if (!query) return articles;

  return fuzzySearch(articles.map((a) => Object.assign({}, a)), query);
}

const articles = [
  {
    "id": "article-1",
    "title": "Sweet I love lollipop sweet jelly",
    "description": "Cheesecake topping cupcake toffee jujubes. Caramels gingerbread cake candy canes icing cake ice cream. Marshmallow brownie ice cream marzipan gummies cake tiramisu.",
  },
  {
    "id": "article-2",
    "title": "Tart toffee tiramisu jelly-o candy topping.",
    "description": "Biscuit gingerbread tart oat cake I love dessert muffin. Sweet icing cotton candy I love I love chocolate cake.",
  },
]
function App() {
  const [query, setQuery] = useState();
  const filteredArticles = filterArticlesByQuery(query, articles);
  return (
    <div className="App">
      <div>
        <form className='Search-form'>
          <input
            id='search-input'
            className='Search-input'
            placeholder='Search'
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </form>
      </div>
      <div className="Articles">
        {filteredArticles.map((article) => (
          <article className='Article'>
            <div className='Article-content'>
              <h4 className='Article-title'>{article.title}</h4>
              <p className='Article-description'>{article.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default App;
