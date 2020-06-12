'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};



const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    titles: '.post-title',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

function titleClickHandler(event) {
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links - wyszukuje wszystkie elementy pasujące do selektora  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active'); //usuwa klasę active z wcześniej wyszukanego elementu
  }

  /* [DONE] add class 'active' to the clicked link */
  event.preventDefault(); //wyłącza domyślne zachowania przeglądarki przy kliknięciu w linki
  const clickedElement = this; //wskazuje na element, do którego dodany jest listener
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link - zwraca wartość atrybutu o podanej nazwie ('href') */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) - wyszukuje pierwszy element pasujący do selektora */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {
  console.log('Link was generated!');

  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = ''; //wymazuje zawartość titleList (.titles)

  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  let html = '';

  for (let article of articles) {
    console.log(article);
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(select.all.titles).innerHTML; 
    /* get the title from the title element */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    
    /* create HTML of the link - pobiera element z html ale unika serializacji */
    titleList.insertAdjacentHTML('afterbegin', linkHTML); 
    /* insert link into html variable */
    html = html + linkHTML;
    console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler); //ustawia nasłuchiwanie kliku na titleClickHandler
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {max: 0, min: 999999};
  
  for(let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
    console.log(tag + ' is used ' + tags[tag] + ' times');
  }

  return params;
}

function calculateTagClass(count, params) {
  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opts.tagSizes.count + 1 );
  return opts.tagSizes.classPrefix + classNumber; 
}


function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles - znajduje wszystkie .post w dokumencie */
  const articles = document.querySelectorAll(select.all.articles); 
  console.log('articles: ' + articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper - znajduje wszystkie .post-tags .list w pętli artykułu */
    const tagsWrapper = article.querySelector(select.article.tags); 
    console.log('tag wrapper: ' + tagsWrapper);
    /* make html variable with empty string - zmienna html ma pustą wartość */
    let html = '';                                      
    /* get tags from data-tags attribute - zwraca wartość atrybutu o podanej nazwie ('data-tags') */
    const articleTags = article.getAttribute('data-tags'); 
    console.log(articleTags);
    /* split tags into array - rozbicie data-tags na osobne tablice */
    const articleTagsArray = articleTags.split(' '); 
    console.log('tags array: ' + articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li><br>';
      
      console.log('give: ' + linkHTML);
      /* add generated code to html variable - nadanie zmiennej html wartości stałej linkHTML */
      html = html + linkHTML; 
      console.log(html);
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }       
                                 
    }
    /* insert HTML of all the links into the tags wrapper - wstawienie wartości zmiennej html do stałej tagsWrapper w pliku HTML */
    tagsWrapper.innerHTML = html;
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  /* [NEW] add html from allTags to tagList - tagList.innerHTML = allTags.join(' '); - dodajemy do listy wszystkie linki za pomocą spacji */
  
  const tagsParams = calculateTagsParams(allTags);
  console.log(tagsParams);
  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags */
  for (let tag in allTags) {
    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    console.log('tagLinkHTML ' + tagLinkHTML);
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += '<li><a class="'+ tagLinkHTML +'" href="#tag-' + tag + '">' + tag + ' </a> (' + allTags[tag] + ')' + '</li>' ;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  
  /* [NEW] add html from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData); 
}

generateTags();


function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant - zastąpienie części treści przypisanej do stałej href (#tag- na nic) */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]'); //odnalezienie wszystkich aktywnych <a> których atrybut href zaczyna się od #tag- (^="coś tam") 
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
  /* remove class active */
    activeTagLink.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant - odnalezienie wszystkiech <a> z atrybutem href i stałą href */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  
  /* execute function "generateTitleLinks" with article selector as argument - (~=) w tym wypadku oznacza znajdź wszystkie elementy z atrybutem data-tags które mają w sobie słowo tag */
  generateTitleLinks('[data-tags~="'+ tag +'"]'); 
}

function addClickListenersToTags() {
  /* find all links to tags - znajduje wszystkie <a> których atrybut href zaczyna się od #tag */
  const links = document.querySelectorAll(select.all.linksTo.tags); 
  console.log('to sa linki: ' + links);
 
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();


function calculateAuthorsParams(authors) {
  const params = {max: 0, min: 999999};
  
  for(let author in authors) {
    params.max = Math.max(authors[author], params.max);
    params.min = Math.min(authors[author], params.min);
    console.log(author + ' is used ' + authors[author] + ' times');
  }

  return params;
}

function calculateAuthorClass(count, params) {
  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opts.tagSizes.count + 1 );

  return opts.tagSizes.classPrefix + classNumber; 
}

function generateAuthors() {
  console.log('Author is generated!');
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  console.log('articles: ' + articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(select.article.author);
    console.log('wrapper: ' + authorWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log('author: ' + articleAuthor);
    /* insert HTML of all the links into the author wrapper */
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    //const linkHTML = '<a href="#author-' + articleAuthor +'">' + articleAuthor + '</a>';
    console.log('dej: ' + linkHTML);
    html = html + linkHTML;
    
    if(!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* END LOOP: for every article: */
    authorWrapper.innerHTML = html;
  }

  const authorList = document.querySelector(select.listOf.authors);
  const authorParams = calculateAuthorsParams(allAuthors);
  console.log(authorParams);

  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};

  for(let author in allAuthors) {
    const authorLinkHTML = calculateAuthorClass(allAuthors[author], authorParams);
    console.log('authorLinkHTML: ' + authorLinkHTML);
    //allAuthorsHTML += '<li><a class="'+ authorLinkHTML +'" href="#author-' + author + '">' + author + ' </a> (' + allAuthors[author] + ')' + '</li>'; 
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateAuthorClass(allAuthors[author], authorParams)
    });
  }
  
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  console.log(allAuthors);
}

generateAuthors();


function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) {
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found author link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="'+ author +'"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const links = document.querySelectorAll(select.all.linksTo.authors);
  /* START LOOP: for each link */
  for (let link of links) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();