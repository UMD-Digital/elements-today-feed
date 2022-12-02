declare global {
  interface Window {
    TodayFeedElement: typeof TodayFeedElement;
  }
}

type EventType = {
  id: number;
  title: string;
  postDate: string;
  url: string;
  summary: string;
  image: {
    url: string;
    altText: string;
  }[];
  categories: {
    title: string;
  }[];
};

type VariablesType = {
  related?: string[];
};

const EventsQuery = `
  query getArticlesByCategories($related: [QueryArgument]) {
    entries(
      section: "articles", 
      categoryCampusUnitsMultiple: $related,
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
        categories:categoryCampusUnitsMultiple {
          title
          id
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

const TODAY_PRODUCTION_URL = 'https://today.umd.edu/';

const CONTAINER_CLASS = 'umd-today-feed-container';
const LOADER_CLASS = 'umd-today-loader';
const NO_RESULTS_CLASS = 'umd-today-no-results';
const CONTAINER_CONTENT_CLASS = 'umd-today-feed-content-container';
const EVENT_CONTAINER_CLASS = 'umd-today-feed-event-container';
const EVENT_IMAGE_CONTAINER_CLASS = 'umd-today-feed-event-image-container';
const EVENT_TEXT_CONTAINER_CLASS = 'umd-today-feed-event-text-container';
const EVENT_TEXT_DATE_CLASS = 'umd-today-feed-event-text-date';
const EVENT_TEXT_TITLE_CLASS = 'umd-today-feed-event-text-title';
const EVENT_CTA_CLASS = 'umd-today-feed-event-cta';
const DATA_CONTAINER_AMOUNT = 'data-event-amount';

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
      [${DATA_CONTAINER_AMOUNT}="1"] .${EVENT_CONTAINER_CLASS} {
        display: flex;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="1"] .${EVENT_IMAGE_CONTAINER_CLASS} {
        width: 40%;
      }
    }

    @media (min-width: ${Breakpoints.tabletMin}px) {
      [${DATA_CONTAINER_AMOUNT}="1"] .${EVENT_TEXT_CONTAINER_CLASS}  {
        margin-left: 20px;
      }
    }

    [${DATA_CONTAINER_AMOUNT}="1"] .${EVENT_CTA_CLASS} {
      position: relative;
      bottom: 0;
      left: 0;
      margin-top: 20px;
      display: inline-block;
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

    [${DATA_CONTAINER_AMOUNT}="3"] > div {
     
    }

    .${EVENT_CONTAINER_CLASS} {
      border: 1px solid ${Colors.grayLight};
      position: relative;
    }

    .${EVENT_IMAGE_CONTAINER_CLASS} {
      aspect-ratio: 16/9;
    }

    .${EVENT_IMAGE_CONTAINER_CLASS} > a {
      height: 100%;
      display: block;
      overflow: hidden;
    }

    .${EVENT_IMAGE_CONTAINER_CLASS} > a:hover img,
    .${EVENT_IMAGE_CONTAINER_CLASS} > a:focus img {
      scale: 1.05;
    }

    .${EVENT_IMAGE_CONTAINER_CLASS} img {
      object-fit: cover;
      object-position: center;
      height: 100%;
      width: 100%;
      scale: 1.0;
      transition: scale 0.3s ease-in-out;
    }

    .${EVENT_TEXT_CONTAINER_CLASS} {
      border-top: 1px solid ${Colors.grayLight};
      padding: 30px 20px;
      padding-bottom: 60px;
    }

    .${EVENT_TEXT_CONTAINER_CLASS} p {
      line-height: 1.4em;
      font-size: 16px;
    }

    .${EVENT_TEXT_TITLE_CLASS} {
      font-size: 20px;
      line-height: 1.2em;
      font-weight: 700;
      color: ${Colors.grayDark};
      margin-bottom: 20px;
    }

    .${EVENT_TEXT_TITLE_CLASS} a {
      color: currentColor;
      text-decoration: none;
      transition: color 0.3s ease-in-out;
    }

    .${EVENT_TEXT_TITLE_CLASS} a:hover,
    .${EVENT_TEXT_TITLE_CLASS} a:focus {
      color: ${Colors.redDark};
    }

    .${EVENT_TEXT_DATE_CLASS} {
      margin-bottom: 20px;
      font-weight: 600;
    }

    .${EVENT_TEXT_DATE_CLASS} {
      display: flex;
    }

    .${EVENT_TEXT_DATE_CLASS} > div {
      background-color: ${Colors.grayLight};
      padding: 4px 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
    }

    .${EVENT_TEXT_DATE_CLASS} > div:nth-child(2) {
      margin-left: 10px;
    }

    .${EVENT_TEXT_DATE_CLASS} > div * {
      font-size: 12px;
      font-weight: 700;
    }

    .${EVENT_TEXT_DATE_CLASS} > div > span {
     border-left: 1px solid ${Colors.grayDark};
     padding-left: 6px;
     margin-left: 4px;
     display: inline-block;
    }

    .${EVENT_CTA_CLASS} {
      display: inline-block;
      color: ${Colors.red};
      transition: color 0.3s ease-in-out;
      position: absolute;
      bottom: 20px;
      left: 20px;
    }

    .${EVENT_CTA_CLASS}:hover,
    .${EVENT_CTA_CLASS}:focus {
      color: ${Colors.redDark};
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
  text.innerHTML = 'There are no events at this time.';

  container.appendChild(text);

  return container;
};

const MakeContentContainer = ({ eventAmount }: { eventAmount: number }) => {
  const container = document.createElement('div');

  container.classList.add(CONTAINER_CONTENT_CLASS);
  container.setAttribute(DATA_CONTAINER_AMOUNT, eventAmount.toString());

  return container;
};

const MakeImageContainer = (event: EventType) => {
  const imageContainer = document.createElement('div');
  const link = document.createElement('a');
  const image = document.createElement('img');
  imageContainer.classList.add(EVENT_IMAGE_CONTAINER_CLASS);

  link.setAttribute('href', event.url);
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');

  image.setAttribute('src', `${TODAY_PRODUCTION_URL}${event.image[0].url}`);
  image.setAttribute('alt', event.image[0].altText);

  console.log(event);

  link.appendChild(image);
  imageContainer.appendChild(link);

  return imageContainer;
};

const MakeDate = (event: EventType) => {
  const dateWrapper = document.createElement('div');

  return dateWrapper;
};

const MakeTextContainer = (event: EventType) => {
  const parser = new DOMParser();
  const textContainer = document.createElement('div');
  const eventTitle = document.createElement('h2');
  const link = document.createElement('a');
  const cta = document.createElement('a');
  const summaryText = parser.parseFromString(event.summary, 'text/html');
  const date = MakeDate(event);

  textContainer.classList.add(EVENT_TEXT_CONTAINER_CLASS);
  eventTitle.classList.add(EVENT_TEXT_TITLE_CLASS);

  link.setAttribute('href', event.url);
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.textContent = event.title;

  cta.classList.add(EVENT_CTA_CLASS);
  cta.setAttribute('href', event.url);
  cta.setAttribute('rel', 'noopener noreferrer');
  cta.setAttribute('target', '_blank');
  cta.setAttribute('aria-label', `View full event details for ${event.title}`);
  cta.innerHTML = 'Learn More';

  eventTitle.appendChild(link);
  textContainer.appendChild(date);
  textContainer.appendChild(eventTitle);
  if (event.summary) textContainer.appendChild(summaryText.body);
  textContainer.appendChild(cta);

  return textContainer;
};

const MakeEvent = (event: EventType) => {
  const eventContainer = document.createElement('div');
  const image = MakeImageContainer(event);
  const text = MakeTextContainer(event);

  eventContainer.classList.add(EVENT_CONTAINER_CLASS);

  eventContainer.appendChild(image);
  eventContainer.appendChild(text);

  return eventContainer;
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
      query: EventsQuery,
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
  _categories: string | null = null;

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
      this._categories = newValue;
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

    const addEvents = async () => {
      const variables: VariablesType = {};

      if (this._categories) {
        variables.related = [this._categories];
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
          eventAmount: data.length,
        });

        data.forEach((event: EventType) => {
          const eventElement = MakeEvent(event);
          contentContainer.appendChild(eventElement);
        });

        container.appendChild(contentContainer);
      }
    };

    addEvents();
  }
}

if (!window.customElements.get(ELEMENT_NAME)) {
  window.TodayFeedElement = TodayFeedElement;
  window.customElements.define(ELEMENT_NAME, TodayFeedElement);
}
