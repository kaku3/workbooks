class Detail {
  constructor(panelSelector, pages, onClickLink) {
    this.$panel = $(panelSelector);
    this.pages = pages;

    this.onClickLink = onClickLink;

    const self = this;
    this.$panel.find('.detail-close').on('click', function() {
      self.hide();
    });
  }

  show(pageId) {
    this.$panel.addClass('active');
    this.showContent(pageId);
  }
  hide() {
    this.$panel.removeClass('active');
  }

  showContent(pageId) {
    const self = this;

    const page = this.pages.find(p => p.id === pageId);
    console.log(page);

    const $container = $('.detail-content').empty();

    $container.append(`
      <div class="name">${page.name}</div>
    `);

    // 画面イメージ
    const $pageImage = $(`<img class="page-image" src="./images/${page.id}.png" />`);
    $pageImage.on("error", function() {
      $(this).remove();
    });
    $container.append($pageImage);

    // 内容
    const description = page.description
      .replace(/\n/g, '<br />')
      .replace(/(https?:\/\/[^\s]+)/g, function(url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    $container.append(`
      <div class="header">説明</div>
      <div class="description">${description}</div>
    `);

    // 画面遷移
    if(page.links) {
      $container.append('<div class="header">画面遷移</div>');
      const $linksContainer = $('<div class="links-container"></div>');

      const sectionNames = Array.from(new Set(page.links.map(l => l.sectionName)));
      sectionNames.forEach(sectionName => {
        if(sectionName !== '') {
          $linksContainer.append(`<div class="section">${sectionName}</div>`);
        }
        const links = page.links.filter(l => l.sectionName === sectionName);
        links.forEach((link) => {
          const _layout = link.layout ? `<div class="layout">${link.layout}</div>` : '';
          $linksContainer.append(`
            <div class="link" data-id="${link.linkToId}">
              ${_layout}
              <div class="name">${link.text}</div>
            </div>
          `);
        });
      })
      $container.append($linksContainer);

      $linksContainer.find('.link').on('click', function(e) {
        const id = $(this).data('id');

        if(self.onClickLink) {
          self.onClickLink(id);
        }
      });
    }
  }
}