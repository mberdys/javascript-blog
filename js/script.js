'use strict';

function titleClickHandler(event) {
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active'); //wyszukuje wszystkie elementy pasujące do selektora

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

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href'); //zwraca wartość atrybutu o podanej nazwie ('href')
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector); //wyszukuje pierwszy element pasujący do selektora
  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';

function generateTitleLinks(customSelector = '') {
  console.log('Link was generated!');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = ''; //wymazuje zawartość titleList (.titles)

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    console.log(article);
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; //??
    /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log(articleId + articleTitle);
    /* create HTML of the link */
    titleList.insertAdjacentHTML('afterbegin', linkHTML); //pobiera element z html ale unika serializacji
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


function generateTags() {
  console.log('Tag was generated!');
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector); //znajduje wszystkie .post w dokumencie
  console.log('articles: ' + articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector); //znajduje wszystkie .post-tags .list w pętli artykułu
    console.log('tag wrapper: ' + tagsWrapper);
    /* make html variable with empty string */
    let html = '';                                      //zmienna html ma pustą wartość
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags'); //zwraca wartość atrybutu o podanej nazwie ('data-tags')
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' '); //rozbicie data-tags na osobne tablice
    console.log('tags array: ' + articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</li><br>';
      console.log(linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML; //nadanie zmiennej html wartości stałej linkHTML
      console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html; //wstawienie zmiennej wartości zmiennej html do stałej tagsWrapper w pliku HTML
  /* END LOOP: for every article: */
  }
  
}

generateTags();


function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');  //zastąpienie części treści przypisanej do stałej href (#tag- na nic)
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]'); //odnalezienie wszystkich aktywnych <a> których atrybut href zaczyna się od #tag- (^="coś tam") 
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
  /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]'); //odnalezienie wszystkiech <a> z atrybutem href i stałą href
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="'+ tag +'"]'); // (~=) w tym wypadku oznacza znajdź wszystkie elementy z atrybutem data-tags które mają w sobie słowo tag
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]'); //znajduje wszystkie <a> których atrybut href zaczyna się od #tag
  console.log('to sa linki: ' + links);
 
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();


function generateAuthors(){
  console.log('Author is generated!');
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('articles: ' + articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    console.log('wrapper: ' + authorWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log('author: ' + articleAuthor);
    /* insert HTML of all the links into the author wrapper */
    const linkHTML = '<p class="post-author"><a href="#author' + articleAuthor +'">' + articleAuthor + '</a></p>';
    console.log('linkhtml: ' + linkHTML);
    html = html + linkHTML;
    /* END LOOP: for every article: */
    authorWrapper.innerHTML = html;
  }
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
  const author = href.replace('#author', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author"]');
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

function addClickListenersToAuthors(){
  /* find all links to authors */
  const links = document.querySelectorAll('a[href^="#author"]');
  /* START LOOP: for each link */
  for (let link of links) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();