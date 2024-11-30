$(function() {
  initMenu();
  initScreenList(SCREENS);

  Sitemap.initSitemap(SCREENS, onClickSitemapPage);
  $("#sitemap-container-wrapper").mousedragscrollable();

  const detail = new Detail(".detail-panel", SCREENS, onClickLink);

  function initMenu() {
    // メニュー操作
    $('.menu-toggle').click(function() {
      $('.side-menu').addClass('open');
      $('.main-content').addClass('shifted');
    });

    $('.menu-close').click(function() {
        $('.side-menu').removeClass('open');
        $('.main-content').removeClass('shifted');
    });
  }

  // スクリーン一覧の表示
  function initScreenList(pages) {
    const $pageList = $('.page-list');
    $pageList.empty();

    for (const page of pages) {
      const $item = $(`<div data-id="${page.id}">`)
        .addClass('page-list-item')
        .html(`
          <div class="page-id">${page.id}</div>
          <div class="page-title">${page.name}</div>
        `)
        .click(function() {
          const id = $(this).data('id');
          onClickLink(id);
        });

      $pageList.append($item);
    }
  }

  function setActiveScreenListPage(pageId) {
    const $pageList = $('.page-list');
    $pageList.find('> .page-list-item').removeClass('active');
    $pageList.find(`[data-id="${pageId}"`).addClass('active');
  }

  function onClickSitemapPage(pageId) {
    Sitemap.setActive(pageId, false);
    detail.show(pageId);
    setActiveScreenListPage(pageId);
  }

  function onClickLink(pageId) {
    Sitemap.setActive(pageId, true);
    detail.show(pageId);
    setActiveScreenListPage(pageId);
  }

});