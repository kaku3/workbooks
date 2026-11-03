export const shareURL = 'https://kaku3.github.io/workbooks/design-block-drill/index.html';
export const shareText = '設計ブロックドリル\nつないで、動かして、設計を身につける\n#workbooks #設計ブロックドリル';
export function installSharing() {
  const x = document.querySelector('#shareX'), line = document.querySelector('#shareLine');
  x.href = `https://twitter.com/intent/tweet?${new URLSearchParams({ url: shareURL, text: shareText })}`;
  // https://developers.line.biz/en/docs/line-social-plugins/install-guide/using-line-share-buttons/
  line.href = `https://social-plugins.line.me/lineit/share?${new URLSearchParams({ url: shareURL, text: shareText })}`;
  const copy = document.querySelector('#copyShare'), status = document.querySelector('#shareStatus');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareURL}`);
      status.textContent = '共有文をコピーしました';
    } catch {
      status.textContent = '共有文を選択してコピーしてください';
      const text = document.querySelector('#shareCopyText');
      text.hidden = false; text.value = `${shareText}\n${shareURL}`; text.focus(); text.select();
    }
  });
}
