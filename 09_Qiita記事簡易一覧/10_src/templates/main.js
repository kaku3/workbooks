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
  filterByIds(
    [
      "2c8d4d783be7ce4fc9ea",
      "0bf1703cb8d6f84afbc5",
    ],
    '.recommend-1[role=articles]',
    '新卒エンジニア向け手紙'
  );
  filterByIds(
    [
      "fb949aa1a53f1f71c796",
      "aa2f81cf1e3974b8ad3a",
      "937354cc180c8bee823b",
      "b1c94328f273c750286b",
    ],
    '.recommend-2[role=articles]',
    '新卒エンジニア向け記事'
  );
  filterByIds(
    [
      "cafccb1ee631d9f61190",
      "422b5427024d29da6a6e",
    ],
    '.recommend-3[role=articles]',
    'パイセン向け記事'
  );
  filterByIds(
    [
      "34b40446337a59213a75",
      "f8411523cce000de750e",
      "5b11d2e1aace73c36340",
    ],
    '.recommend-4[role=articles]',
    '...は難しいシリーズ'
  );
  filterByIds(
    [
      "03aae7b9e3c70c55f513",
      "3378ea55b1240d7360a1",
    ],
    '.recommend-5[role=articles]',
    '営業A短編シリーズ'
  );
  filterByLikesCount(
    20,
    '.rankings-likes[role=articles]',
    'Top20'
  );
  filterByStocksCount(
    20,
    '.rankings-stocks[role=articles]',
    'Top20'
  );
  filterByDateDesc(
    3,
    '.search-result[role=articles]',
    '新着'
  );


  initKeywordFilter();
  initMenu();
  initTab();

  function initMenu() {
    $('#toggle-navigation-menu').on('click', function(e) {
      $('nav').toggleClass('open');
    });
  }

  function initTab() {
    $('.tab-navigation > .tab-navigation-item').on('click', function(e) {
      if($(this).hasClass('active')) {
        return;
      }
      $(this).parent().find('.tab-navigation-item').removeClass('active');
      $(this).addClass('active');
      const id = '#' + $(this).data('tab-contents');
      $('.tab-contents > .tab-contents-container').removeClass('active');
      $(`.tab-contents > ${id}`).addClass('active');
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

  /**
   * TagSection による記事検索
   * @param {*} tagSection 
   */
  function searchByTagSection(tagSection) {
    console.log('+ searchByTagSection', tagSection);
    const tags = TAGS[tagSection];

    const searchedArticles = ARTICLES.filter(a => a.tags.some(t => tags.includes(t.name))).sort();
    drawArticles(searchedArticles, '.search-result[role=articles]', `カテゴリ : ${tagSection}`);
  }
  /**
   * Tag による記事検索
   * @param {*} tag 
   */
  function searchByTag(tag) {
    console.log('+ searchByTag', tag);

    const re = new  RegExp(`^${tag}$`, 'i')

    const searchedArticles = ARTICLES.filter(a => a.tags.some(t => re.test(t.name))).sort();
    drawArticles(searchedArticles, '.search-result[role=articles]', `タグ : ${tag}`);
  }

  function filterByDateDesc(count, target, label) {
    console.log('+ filterByDateDesc', count);

    const foundArticles = ARTICLES.sort((a, b) => a.updated_at < b.updated_at ? 1 : -1).slice(0, count);
    drawArticles(foundArticles, target, label);
  }

  /**
   * id 配列で記事取得
   * @param {*} ids 
   * @param {*} target 
   * @param {*} label 
   */
  function filterByIds(ids, target, label) {
    console.log('+ filterByIds', ids);

    const foundArticles = ARTICLES.filter(a => ids.includes(a.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    drawArticles(foundArticles, target, label);
  }

  /**
   * いいね順で記事取得
   * @param {*} count 
   * @param {*} target 
   * @param {*} label 
   */
  function filterByLikesCount(count, target, label) {
    console.log('+ filterByLikesCount', count);
    const foundArticles = ARTICLES.sort((a, b) => b.likes_count - a.likes_count).slice(0, count);
    drawArticles(foundArticles, target, label);
  }

  /**
   * ストック順で記事取得
   * @param {*} count 
   * @param {*} target 
   * @param {*} label 
   */
  function filterByStocksCount(count, target, label) {
    console.log('+ filterByStocksCount', count);
    const foundArticles = ARTICLES.sort((a, b) => b.stocks_count - a.stocks_count).slice(0, count);
    drawArticles(foundArticles, target, label);
  }

  /**
   * 左メニュー描画
   */
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

  /**
   * TagSection 一覧描画
   */
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

  /**
   * 記事リスト描画
   * @param {*} articles 描画対象記事リスト
   * @param {*} target 描画先
   * @param {*} label ラベル
   */
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
            <div class="article-title">${article.title}</div>
            <div class="article-information">
              <div class="favorite count">
                <span class="material-symbols-outlined">
                  favorite
                </span>
                <span>${article.likes_count}</span>
              </div>
              <div class="stock count">
                <span class="material-symbols-outlined">
                  save
                </span>              
                <span>${article.stocks_count}</span>
              </div>
              <ul class="article-tags-container">${_tags}</ul>
            </div>
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