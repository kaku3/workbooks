$(function() {
  $("#sitemap-container-wrapper").mousedragscrollable();

  initSitemap();
  drawSitemap();

  function initSitemap() {
    const depthFrom = PAGES.map(p => p.depth).reduce((a, c) => Math.min(a, c));
    const depthTo = PAGES.map(p => p.depth).reduce((a, c) => Math.max(a, c));
    for(let depth = depthFrom; depth <= depthTo; depth++) {
      let pos = 0;
      PAGES.filter(p => p.depth === depth).forEach((page) => {
        if(page.pos) {
          pos = page.pos;
        } else {
          page.pos = pos;
        }
        page.links?.forEach((link) => {
          if(link.url?.startsWith('#')) {
            link.url = page.url + link.url;
          }
        })
        pos++;
      });
    }
    // 親の pos の方が大きかったらそちらに合わせる
    for(let depth = depthFrom + 1; depth <= depthTo; depth++) {
      const pages = PAGES.filter(p => p.depth === depth);
      for(let page of pages) {
        const parents = PAGES.filter(p => p.depth === depth - 1);
        const parent = parents?.find(p => p.links?.find(l => l.url === page.url));
        if(parent && parent.pos > page.pos) {
          page.pos = parent.pos;
        }
      }
    }
  }

  function drawSitemap() {
    const $container = $('#sitemap-container');
    const depthFrom = PAGES.map(p => p.depth).reduce((a, c) => Math.min(a, c));
    const depthTo = PAGES.map(p => p.depth).reduce((a, c) => Math.max(a, c));
    for(let depth = depthFrom; depth <= depthTo; depth++) {
      const $levelContainer = $(`<div class="level-container level-${depth}"></div>`);
      const pages = PAGES.filter(p => p.depth === depth);
      let pos = 0;
      for(let p in pages) {
        const page = pages[p];
        for(; pos < page.pos; pos++) {
          $levelContainer.append('<div class="page empty"></div>');
        }

        $levelContainer.append(`
          <div class="page" data-name="${page.name}" data-url="${page.url}">
            <div class="name">
              ${page.name}
            </div>
            <div class="url">
              ${page.url}
            </div>
          </div>
        `);
        pos++;
      }
      $container.append($levelContainer);

      $(".page", $container).on('click', function(e) {
        const url = $(this).data('url');

        if(!$(this).hasClass('active')) {
          updateActivePage(url);
        }
      })
      pos++;
    }
    drawSitemapSvg();
  }
  function drawSitemapSvg() {
    const $container = $('#sitemap-container');
    const $svg = $('svg', $container).empty();
    PAGES.forEach(page => {
      const $from = $(`.page[data-url="${page.url}"]`, $container);
      const p0 = getCenterPosition($from);
      page.links?.forEach(link => {
        const $to = $(`.page[data-url="${link.url}"]`, $container);
        if($to.length > 0) {
          const p1 = getCenterPosition($to);
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          if(p0.x !== p1.x) {
            const cx = Math.floor((p0.x + p1.x) / 2);
            path.setAttribute('d', `M ${p0.x},${p0.y} L ${cx},${p0.y} L ${cx},${p1.y} L ${p1.x},${p1.y}`);
          } else {
            path.setAttribute('d', `M ${p0.x},${p0.y} L ${p1.x},${p1.y}`);
          }
          $svg.append(path);
        }
      });            
    });
  }
  function updateActivePage(url) {
    const $container = $('#sitemap-container');
    const $page = $(`.page[data-url="${url}"]`, $container);
    $(".page", $container).removeClass("active");
    $page.addClass("active");

    updatePageInformation(url);
  }

  function updatePageInformation(url) {
    const page = PAGES.find(p => p.url === url);

    const $container = $('#page-information-container').empty();

    $container.append(`
      <div class="name">${page.name}</div>
    `);

    // 画面イメージ
    console.log(url);
    const $pageImage = $(`<img class="page-image" src="./images${url}.png" />`);
    $pageImage.on("error", function() {
      $(this).remove();
    });
    $container.append($pageImage);

    // 内容
    const content = page.content
      .replace(/\n/g, '<br />')
      .replace(/(https?:\/\/[^\s]+)/g, function(url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    $container.append(`
      <div class="header">説明</div>
      <div class="content">${content}</div>
    `);

    // 画面遷移
    if(page.links) {
      $container.append('<div class="header">画面遷移</div>');
      const $linksContainer = $('<div class="links-container"></div>');
      page.links.forEach((link) => {
        const _layout = link.layout ? `<div class="layout">${link.layout}</div>` : '';
        $linksContainer.append(`
          <div class="link" data-url="${link.url}">
            ${_layout}
            <div class="name">${link.name}</div>
          </div>
        `);
      });
      $container.append($linksContainer);

      $('.link', $linksContainer).on('click', function(e) {
        const url = $(this).data('url');
        const $page = $(`.page[data-url="${url}"]`, '#sitemap-container');
        if($page.length > 0) {
          $page.get(0).scrollIntoView();
          updateActivePage(url);
        }
      });
    }

  }

  function getCenterPosition(e) {
    return {
      x: Math.floor(e.position().left + e.width() / 2),
      y: Math.floor(e.position().top + e.height() / 2)
    }
  }
});
