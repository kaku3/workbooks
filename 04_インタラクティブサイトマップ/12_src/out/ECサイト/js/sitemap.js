class Sitemap {
  static initSitemap(pages, onClickPage = null) {
    Sitemap.pages = pages;

    Sitemap.#prepare(pages);
    Sitemap.#drawSitemap(pages, onClickPage);
    Sitemap.#drawSitemapSvg(pages);
  }
  static #prepare(pages) {
    const depthFrom = pages.map(p => p.depth).reduce((a, c) => Math.min(a, c));
    const depthTo = pages.map(p => p.depth).reduce((a, c) => Math.max(a, c));

    for(let depth = depthFrom; depth <= depthTo; depth++) {
      let pos = 0;
      pages.filter(p => p.depth === depth).forEach((page) => {
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
      const _pages = pages.filter(p => p.depth === depth);
      for(let page of _pages) {
        const parents = pages.filter(p => p.depth === depth - 1);
        const parent = parents?.find(p => p.links?.find(l => l.url === page.url));
        if(parent && parent.pos > page.pos) {
          page.pos = parent.pos;
        }
      }
    }
  }
  
  static setActive(pageId, scrollIntoView = false) {
    const $container = $('#sitemap-container');
    const $pages = $container.find(".page");
    $pages.removeClass('active link-to');

    const $page = $container.find(`.page[data-id="${pageId}"]`)
    $page.addClass('active');

    const page = Sitemap.pages.find(p => p.id === pageId);
    if(page) {
      for(const link of page.links) {
        const $link = $container.find(`.page[data-id="${link.linkToId}"]`)
        $link.addClass('link-to');
      }
    }

    if(scrollIntoView) {
      $page.get(0).scrollIntoView();
    }
  }

  static setHover(pageId) {
    const $container = $('#sitemap-container');
    const $pages = $container.find(".page");
    $pages.removeClass('hover');
    if(pageId) {
      const $page = $container.find(`.page[data-id="${pageId}"]`)
      $page.addClass('hover');
    }
  }

  static #drawSitemap(pages, onClickPage) {
    const $container = $('#sitemap-container');
    const depthFrom = pages.map(p => p.depth).reduce((a, c) => Math.min(a, c));
    const depthTo = pages.map(p => p.depth).reduce((a, c) => Math.max(a, c));
    for(let depth = depthFrom; depth <= depthTo; depth++) {
      const $levelContainer = $(`<div class="level-container level-${depth}"></div>`);
      const _pages = pages.filter(p => p.depth === depth);
      let pos = 1;
      for(let p in _pages) {
        const page = _pages[p];

        for(; pos < page.pos; pos++) {
          $levelContainer.append('<div class="page empty"></div>');
        }
  
        $levelContainer.append(`
          <div class="page" data-name="${page.name}" data-id="${page.id}">
            <div class="name">
              <span>${page.id}</span>
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
  
      const $pages = $container.find(".page");

      $pages.on('click', function(e) {
        const id = $(this).data('id');
  
        if(!$(this).hasClass('active')) {
          onClickPage(id);
        }
      })
      pos++;
    }
  }
  static #drawSitemapSvg(pages) {
    const colors = [
      '#617c98',  // くすんだ青
      '#629b7c',  // くすんだ緑
      '#8b7a9c',  // くすんだ紫
    ];

    const $container = $('#sitemap-container');
    const $svg = $('svg', $container).empty();
    pages.forEach((page, p) => {
      const $from = $(`.page[data-id="${page.id}"]`, $container);
      const p0 = Sitemap.#getCenterPosition($from);

      page.links?.forEach((link, i) => {
        let ox = i * 4 - ((page.links.length - 1) * 2);
        let oy = i * 4 - 16;
        const $to = $(`.page[data-id="${link.linkToId}"]`, $container);
        if($to.length > 0) {
          const p1 = Sitemap.#getCenterPosition($to);
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

          let color = colors[p % colors.length];
          let strokeWidth = 2;
          let strokeOpacity = 0.75;
          // 戻り線
          if(p0.x > p1.x) {
            ox += 20;
            oy = i * 2 + 8;
            color = 'red';
            strokeWidth = 1;
            strokeOpacity = 1;
          }

          if(p0.x !== p1.x) {
            // 横線
            const cx = Math.floor((p0.x + p1.x) / 2);
            path.setAttribute('d', `M ${p0.x},${p0.y + oy} L ${cx + ox},${p0.y + oy} L ${cx + ox},${p1.y + oy} L ${p1.x},${p1.y + oy}`);
          } else {
            // 縦線
            path.setAttribute('d', `M ${p0.x + ox},${p0.y} L ${p1.x + ox},${p1.y}`);
          }
          path.setAttribute('stroke', color);
          path.setAttribute('stroke-width', strokeWidth);
          path.setAttribute('stroke-opacity', strokeOpacity);
          path.setAttribute('data-from-id', page.id);
          path.setAttribute('data-to-id', link.linkToId);
          $svg.append(path);
        }
      });            
    });
  }
  static #getCenterPosition(e) {
    return {
      x: Math.floor(e.position().left + e.width() / 2),
      y: Math.floor(e.position().top + e.height() / 2)
    }
  }
}
