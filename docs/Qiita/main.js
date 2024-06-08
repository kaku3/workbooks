$(function() {
  const isMobile = () => window.innerWidth < 768;

  const COLORS = [
    { bg: "#F44336", fg: "white" },
    { bg: "#E91E63", fg: "white" },
    { bg: "#9C27B0", fg: "white" },
    { bg: "#673AB7", fg: "white" },
    { bg: "#3F51B5", fg: "white" },
    { bg: "#2196F3", fg: "white" },
    { bg: "#03A9F4", fg: "white" },
    { bg: "#00BCD4", fg: "white" },
    { bg: "#009688", fg: "white" },
    { bg: "#4CAF50", fg: "white" },
    { bg: "#8BC34A", fg: "#222" },
    { bg: "#CDDC39", fg: "#222" },
    { bg: "#FFEB3B", fg: "#222" },
    { bg: "#FFC107", fg: "#222" },
    { bg: "#FF9800", fg: "white" },
    { bg: "#FF5722", fg: "white" },
    { bg: "#795548", fg: "white" },
    { bg: "#9E9E9E", fg: "white" },
    { bg: "#607D8B", fg: "white" },
  ];
  
  drawTagMenu();
  drawTagSections();
  findByIds(
    [
      "2c8d4d783be7ce4fc9ea",
      "0bf1703cb8d6f84afbc5",
    ],
    '.recommend-1[role=articles]',
    '新卒エンジニア向け手紙'
  );
  findByIds(
    [
      "fb949aa1a53f1f71c796",
      "aa2f81cf1e3974b8ad3a",
      "937354cc180c8bee823b",
      "b1c94328f273c750286b",
    ],
    '.recommend-2[role=articles]',
    '新卒エンジニア向け記事'
  );
  findByIds(
    [
      "cafccb1ee631d9f61190",
      "422b5427024d29da6a6e",
    ],
    '.recommend-3[role=articles]',
    'パイセン向け記事'
  );
  findByIds(
    [
      "34b40446337a59213a75",
      "f8411523cce000de750e",
      "5b11d2e1aace73c36340",
    ],
    '.recommend-4[role=articles]',
    '...は難しいシリーズ'
  );
  findByIds(
    [
      "03aae7b9e3c70c55f513",
      "3378ea55b1240d7360a1",
    ],
    '.recommend-3[role=articles]',
    '営業A短編シリーズ'
  );
  initKeywordFilter();
  initMenu();

  function initMenu() {
    $('#toggle-navigation-menu').on('click', function(e) {
      $('nav').toggleClass('open');
    });
  }

  function initKeywordFilter() {
    let keyword = "";
    let timerId = -1;
    $('#keyword').on('keyup', function(e) {
      if(timerId != -1) {
        clearTimeout(timerId);
      }

      keyword = $(this).val();

      timerId = setTimeout(function() {
        const re = new  RegExp(keyword, 'i');
        const filteredArticles = keyword ? ARTICLES.filter(a => re.test(a.title) || re.test(a.body)) : [] ;
        drawArticles(filteredArticles, '.search-result[role=articles]', `キーワード : ${keyword}`);
      }, 500);
    });

  }

  function searchByTagSection(tagSection) {
    console.log('+ searchByTagSection', tagSection);
    const tags = TAGS[tagSection];

    const searchedArticles = ARTICLES.filter(a => a.tags.some(t => tags.includes(t.name))).sort();
    drawArticles(searchedArticles, '.search-result[role=articles]', `カテゴリ : ${tagSection}`);
  }
  function searchByTag(tag) {
    console.log('+ searchByTag', tag);

    const re = new  RegExp(`^${tag}$`, 'i')

    const searchedArticles = ARTICLES.filter(a => a.tags.some(t => re.test(t.name))).sort();
    drawArticles(searchedArticles, '.search-result[role=articles]', `タグ : ${tag}`);
  }
  function findByIds(ids, target, label) {
    console.log('+ findByIds', ids);

    const foundArticles = ARTICLES.filter(a => ids.includes(a.id)).sort();
    drawArticles(foundArticles, target, label);
  }

  function drawTagMenu() {
    const articleTags = ARTICLES.flatMap(a => a.tags.map(t => t.name));
    const $tagMenu = $('[role=tag-menu]');

    console.log(articleTags);

    for(const i in Object.keys(TAGS)) {
      const section = Object.keys(TAGS)[i];
      const color = COLORS[i % COLORS.length];
      const $section = $(`
        <li class="tag-menu-section">
          <div name="${section}" class="name" style="background-color:${color.bg}; color:${color.fg}">${section}</div>
          <ul class="tags-container"></ul>
        </li>
      `);
      const $tags = $('<ul class="tags-container"></ul>');
      for(const tag of TAGS[section]) {
        const re = new  RegExp(`^${tag}$`, 'i')

        const count = articleTags.filter(t => re.test(t)).length;
        if(count > 0) {
          $tags.append(`<li class="tag-menu-tag"><a name="${tag}"><span>${tag}</span><span>${count}</span></a></li>`);
        }
      }
      $section.append($tags);
      $tagMenu.append($section);
    }

    $tagMenu.find('li.tag-menu-section > .name').on('click', function(e) {
      const tagSection = $(this).attr('name');
      searchByTagSection(tagSection);

      onSelectNavigationMenu();
    });
    $tagMenu.find('li.tag-menu-section .tag-menu-tag > a').on('click', function(e) {
      const tag = $(this).attr('name');
      searchByTag(tag);

      onSelectNavigationMenu();
    });
  }

  function drawTagSections() {
    const $tagSections = $('[role=tag-sections]');
    const $tagsContainer = $('[role=tags-container]');

    for(const i in Object.keys(TAGS)) {
      const section = Object.keys(TAGS)[i];
      const color = COLORS[i % COLORS.length];

      $tagSections.append(`
        <li>
          <div name="${section}" class="tag-section" style="background-color:${color.bg}; color:${color.fg}">${section}</div>
        </li>
      `);
    }
    $('.tag-section', $tagSections).on('click', function(e) {
      const tagSection = $(this).attr('name');
      onSelectTagSection(tagSection);
    });
  }

  function drawArticles(articles, target, label) {
    console.log('+ drawArticles', articles);
    const $articles = $(target).empty();
    const $label = $(`<label>${label}</label>`);
    const $articlesContainer = $('<ul class="articles-container"></ul>');

    for(const article of articles) {
      const _tags = article.tags.map(tag => {
        return `
          <li>
            <div name="${tag.name}" class="article-tag">${tag.name}</div>
          </li>
        `;
      }).sort().join('');
      $articlesContainer.append(`
        <li>
          <a role="qiita-link" data-id="${article.id}" href="${article.url}" target="qiita">
            <span>${article.title}</span>
            <ul class="article-tags-container">${_tags}</ul>
          </a>
        </li>
      `);
    }
    $articles.append($label);
    $articles.append($articlesContainer);

    $articles.find('.article-tag').on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      const tag = $(this).attr('name');
      searchByTag(tag);

      $('.search-result[role=articles]')[0].scrollIntoView({ behavior: 'smooth' });
    })
  }

  function onSelectTagSection(tagSection) {
    // if(isMobile()) {
    //   $('nav').addClass('open');
    // }

    setTimeout(function() {
      searchByTagSection(tagSection);
      $(`[name=${tagSection}]`, 'nav [role=tag-menu]')[0].scrollIntoView({ behavior: 'smooth' });
    }, isMobile() ? 500 : 0);

  }

  function onSelectNavigationMenu() {
    if(isMobile()) {
      $('nav').removeClass('open');
    }

    setTimeout(function() {
      $('.search-result[role=articles]')[0].scrollIntoView({ behavior: 'smooth' });
    }, isMobile() ? 500 : 0);
  }

  $(window).resize(function() {
    if(isMobile()) {
      $('nav').removeClass('open');
    } else {
      $('nav').addClass('open');
    }
  });
});