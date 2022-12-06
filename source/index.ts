declare global {
  interface Window {
    TodayFeedElement: typeof TodayFeedElement;
  }
}

type ArticleType = {
  id: number;
  title: string;
  url: string;
  summary: string;
  image: {
    url: string;
    altText: string;
  }[];
  categories: {
    title: string;
    url: string;
  }[];
};

type VariablesType = {
  related?: string[];
};

const ArticlesQuery = `
  query getArticlesByCategories($related: [QueryArgument]) {
    entries(
      section: "articles",
      relatedTo: $related,
      limit: 3
    ) {
      ... on articles_today_Entry {
        id
        title
        postDate
        summary: genericText
        url
        image:articlesHeroImage {
          url
          ... on hero_Asset {
            id
            altText: genericText
          }
        }
        categories:categoryTodaySectionMultiple {
          title
          url
        }
      }
    }
  }
`;

const Colors = {
  white: '#fff',
  offWhite: '#f1f1f1',
  grayLight: '#e6e6e6',
  gray: '#222',
  grayDark: '#454545',
  red: '#e21833',
  redDark: '#951022',
  yellow: '#FFD200',
  green: '#70ebd6',
};

const Breakpoints = {
  largeMobileMax: 767,
  tabletMin: 768,
  tabletMax: 1023,
  desktopMin: 1024,
};

const ELEMENT_NAME = 'umd-today-feed';

const template = document.createElement('template');

const TODAY_PRODUCTION_URL = 'https://today.umd.edu';

const CONTAINER_CLASS = 'umd-today-feed-container';
const LOADER_CLASS = 'umd-today-loader';
const NO_RESULTS_CLASS = 'umd-today-no-results';
const CONTAINER_CONTENT_CLASS = 'umd-today-feed-content-container';
const ARTICLE_CONTAINER_CLASS = 'umd-today-feed-article-container';
const ARTICLE_IMAGE_CONTAINER_CLASS = 'umd-today-feed-article-image-container';
const ARTICLE_TEXT_CONTAINER_CLASS = 'umd-today-feed-article-text-container';
const ARTICLE_TEXT_CATEGORY_CLASS = 'umd-today-feed-article-text-category';
const ARTICLE_TEXT_DATE_CLASS = 'umd-today-feed-article-text-date';
const ARTICLE_TEXT_TITLE_CLASS = 'umd-today-feed-article-text-title';
const DATA_CONTAINER_AMOUNT = 'data-article-amount';

template.innerHTML = `
  <style>

    @keyframes loader-first-animation {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes loader-last-animation {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }

    @keyframes loader-middle-animation {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }

    :host {
      position: relative !important;
      display: block;
    }

    :host * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      font-family: 'Source Sans Pro', Helvetica, Arial, Verdana, sans-serif;
    }

    :host img {
      max-width: 100% !important;
    }

    .${LOADER_CLASS} {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      min-height: 40px;
      position: relative;
    }

    .${LOADER_CLASS} > div {
      position: relative;
    }

    .${LOADER_CLASS} > div > div {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${Colors.grayDark};
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    .${LOADER_CLASS} > div > div:nth-child(1) {
      left: 5px;
      animation: loader-first-animation 0.6s infinite;
    }

    .${LOADER_CLASS} > div > div:nth-child(2) {
      left: 5px;
      animation: loader-middle-animation 0.6s infinite;
    }

    .${LOADER_CLASS} > div > div:nth-child(3) {
      left: 24px;
      animation: loader-middle-animation 0.6s infinite;
    }

    .${LOADER_CLASS} > div > div:nth-child(4) {
      left: 45px;
      animation: loader-last-animation 0.6s infinite;
    }

    .${NO_RESULTS_CLASS} {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${NO_RESULTS_CLASS} p {
      font-size: 22px;
      font-weight: 700;
    }

    .${CONTAINER_CONTENT_CLASS} {
       display: grid;
       grid-template-columns: 1fr;
       grid-gap: 40px 0;
     }

     @media (min-width: ${Breakpoints.tabletMin}px) {
       .${CONTAINER_CONTENT_CLASS} {
         grid-gap: 0 30px;
       }
     }

     @media (min-width: ${Breakpoints.tabletMin}px) {
       [${DATA_CONTAINER_AMOUNT}="1"] {
         grid-template-columns: 1fr ;
       }
     }

     @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="1"] .${ARTICLE_CONTAINER_CLASS} {
        display: flex;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="1"] .${ARTICLE_IMAGE_CONTAINER_CLASS} {
        width: 40%;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="1"] .${ARTICLE_TEXT_CONTAINER_CLASS}  {
        margin-left: 20px;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="2"] {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="3"] {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    .${ARTICLE_CONTAINER_CLASS} {
      border: 1px solid ${Colors.grayLight};
      position: relative;
    }

    .${ARTICLE_IMAGE_CONTAINER_CLASS} {
      aspect-ratio: 16/9;
    }

    .${ARTICLE_IMAGE_CONTAINER_CLASS} > a {
      height: 100%;
      display: block;
      overflow: hidden;
    }

    .${ARTICLE_IMAGE_CONTAINER_CLASS} > a:hover img,
    .${ARTICLE_IMAGE_CONTAINER_CLASS} > a:focus img {
      scale: 1.05;
    }

    .${ARTICLE_IMAGE_CONTAINER_CLASS} img {
      object-fit: cover;
      object-position: center;
      height: 100%;
      width: 100%;
      scale: 1.0;
      transition: scale 0.3s ease-in-out;
    }

    .${ARTICLE_TEXT_CONTAINER_CLASS} {
      border-top: 1px solid ${Colors.grayLight};
      padding: 30px 20px;
    }

    .${ARTICLE_TEXT_CONTAINER_CLASS} hr {
      margin: 15px 0 !important;
      padding: 0 !important;
      height: 1px !important;
      background-color: ${Colors.grayLight} !important;
      border: none !important;
      width: 80% !important;
      max-width: 240px !important;
    }

    .${ARTICLE_TEXT_CONTAINER_CLASS} body,
    .${ARTICLE_TEXT_CONTAINER_CLASS} p {
      line-height: 1.4em;
      font-size: 16px;
    }

    .${ARTICLE_TEXT_TITLE_CLASS} {
      font-size: 20px;
      line-height: 1.2em;
      font-weight: 700;
      color: ${Colors.grayDark};
    }

    .${ARTICLE_TEXT_TITLE_CLASS} a {
      color: currentColor;
      text-decoration: none;
      transition: color 0.3s ease-in-out;
    }

    .${ARTICLE_TEXT_TITLE_CLASS} a:hover,
    .${ARTICLE_TEXT_TITLE_CLASS} a:focus {
      color: ${Colors.redDark};
    }

    .${ARTICLE_TEXT_CATEGORY_CLASS} {
      text-decoration: none;
      margin-bottom: 10px;
      font-size: 12px;
      text-transform: uppercase;
      color: ${Colors.grayDark};
      display: block;
      font-weight: 600;
    }
  </style>
`;

const MakeContainer = () => {
  const container = document.createElement('div');

  container.classList.add(CONTAINER_CLASS);

  return container;
};

const MakeLoader = () => {
  const container = document.createElement('div');
  const wrapper = document.createElement('div');
  const first = document.createElement('div');
  const middle = document.createElement('div');
  const last = document.createElement('div');

  container.classList.add(LOADER_CLASS);

  wrapper.appendChild(first);
  wrapper.appendChild(middle);
  wrapper.appendChild(last);

  container.appendChild(wrapper);

  return container;
};

const MakeNoResults = () => {
  const container = document.createElement('div');
  const text = document.createElement('p');

  container.classList.add(NO_RESULTS_CLASS);
  text.innerHTML = 'There are no articles at this time.';

  container.appendChild(text);

  return container;
};

const MakeContentContainer = ({ articleAmount }: { articleAmount: number }) => {
  const container = document.createElement('div');

  container.classList.add(CONTAINER_CONTENT_CLASS);
  container.setAttribute(DATA_CONTAINER_AMOUNT, articleAmount.toString());

  return container;
};

const MakeImageContainer = (article: ArticleType) => {
  const imageContainer = document.createElement('div');
  const link = document.createElement('a');
  const image = document.createElement('img');
  imageContainer.classList.add(ARTICLE_IMAGE_CONTAINER_CLASS);

  link.setAttribute('href', article.url);
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');

  image.setAttribute('src', `${TODAY_PRODUCTION_URL}${article.image[0].url}`);
  image.setAttribute('alt', article.image[0].altText);

  link.appendChild(image);
  imageContainer.appendChild(link);

  return imageContainer;
};

const MakeTextContainer = (article: ArticleType) => {
  const parser = new DOMParser();
  const textContainer = document.createElement('div');
  const articleTitle = document.createElement('h2');
  const link = document.createElement('a');
  const line = document.createElement('hr');
  const category = document.createElement('a');
  const summaryText = parser.parseFromString(article.summary, 'text/html');

  textContainer.classList.add(ARTICLE_TEXT_CONTAINER_CLASS);
  articleTitle.classList.add(ARTICLE_TEXT_TITLE_CLASS);

  link.setAttribute('href', article.url);
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.textContent = article.title;

  if (article.categories.length > 0) {
    category.setAttribute('href', article.categories[0].url);
    category.innerHTML = article.categories[0].title;
    category.classList.add(ARTICLE_TEXT_CATEGORY_CLASS);
    textContainer.appendChild(category);
  }

  articleTitle.appendChild(link);
  textContainer.appendChild(articleTitle);
  textContainer.appendChild(line);
  if (article.summary) textContainer.appendChild(summaryText.body);

  return textContainer;
};

const MakeArticle = (article: ArticleType) => {
  const articleContainer = document.createElement('div');
  const image = MakeImageContainer(article);
  const text = MakeTextContainer(article);

  articleContainer.classList.add(ARTICLE_CONTAINER_CLASS);

  articleContainer.appendChild(image);
  articleContainer.appendChild(text);

  return articleContainer;
};

const fetchEntries = async ({
  variables,
  token,
}: {
  variables: VariablesType;
  token: string;
}) => {
  const response = await fetch(`${TODAY_PRODUCTION_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: ArticlesQuery,
      variables,
    }),
  });

  const responseData = await response.json();

  if (responseData.errors) {
    responseData.errors.forEach((error: any) => console.error(error.message));
  }

  if (responseData && responseData.data) {
    const data = responseData.data;

    if (data.entries && data.entries) {
      return data.entries;
    } else {
      console.log('Articles not found');
    }
  } else {
    console.log('No data found');
  }
};

export default class TodayFeedElement extends HTMLElement {
  _shadow: ShadowRoot;
  _token: string | null = null;
  _categories: string[] | null = null;

  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['token', 'categories'];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'token' && newValue) {
      this._token = newValue;
    }

    if (name === 'categories' && newValue) {
      this._categories = newValue.split(',');
    }
  }

  connectedCallback() {
    if (!this._token || this._token === null) {
      console.error('No token provided');
      return;
    }

    if (!this._categories || this._categories === null) {
      console.error('No filters provided for today feed');
    }

    const addArticles = async () => {
      const variables: VariablesType = {};

      if (this._categories) {
        variables.related = this._categories;
      }

      const container = MakeContainer();
      const loader = MakeLoader();

      container.appendChild(loader);
      this._shadow.appendChild(container);

      const data = await fetchEntries({
        variables: variables,
        token: this._token as string,
      });

      loader.remove();

      if (data.length === 0) {
        const contentContainer = MakeNoResults();
        container.appendChild(contentContainer);
        console.log('Today Feed Element: No articles found');
      } else {
        const contentContainer = MakeContentContainer({
          articleAmount: data.length,
        });

        data.forEach((article: ArticleType) => {
          const articleElement = MakeArticle(article);
          contentContainer.appendChild(articleElement);
        });

        container.appendChild(contentContainer);
      }
    };

    addArticles();
  }
}

if (!window.customElements.get(ELEMENT_NAME)) {
  window.TodayFeedElement = TodayFeedElement;
  window.customElements.define(ELEMENT_NAME, TodayFeedElement);
}
