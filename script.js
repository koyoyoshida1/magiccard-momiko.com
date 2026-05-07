// ==========================================
// 1. メニューの切り替えとスマホ表示制御
// ==========================================
const menuBtn = document.getElementById('menuToggleBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

// ハンバーガーボタン
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
}

// 背景タップで閉じる
if (overlay) {
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// チャンネルグループの折りたたみ
function toggleGroup(headerElement) {
  const group = headerElement.parentElement;
  group.classList.toggle('closed');
}

// ==========================================
// 2. ページの切り替え処理
// ==========================================
function switchPage(pageId, element) {
  // すべてのページを非表示
  const pages = document.querySelectorAll('.page-section');
  pages.forEach(page => page.classList.remove('active-page'));

  // 指定されたページを表示
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active-page');
  }

  // メニューのactive状態を更新
  const items = document.querySelectorAll('.channel-item');
  items.forEach(item => item.classList.remove('active'));
  
  if (element) {
    element.classList.add('active');
  }

  // スマホの場合はメニューを閉じる
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  requestAnimationFrame(() => {
    hydrateMomikoAds(targetPage || document);
    loadVisibleMomikoAds();
  });
}

// ==========================================
// 2.5. 広告枠の初期化
// ==========================================
function hydrateMomikoAds(scope) {
  const root = scope || document;
  const slots = root.querySelectorAll('.momiko-ad');

  slots.forEach((slot) => {
    const ad = slot.querySelector('.adsbygoogle');
    const adSlot = ad && ad.dataset.adSlot ? ad.dataset.adSlot.trim() : '';
    slot.classList.toggle('is-configured', Boolean(adSlot));
  });
}

function loadVisibleMomikoAds() {
  if (!window.adsbygoogle) return;

  const candidates = document.querySelectorAll(
    '.momiko-ad.is-configured .adsbygoogle:not([data-momiko-loaded])'
  );

  candidates.forEach((ad) => {
    const wrapper = ad.closest('.momiko-ad');
    const page = ad.closest('.page-section');
    const isVisiblePage = !page || page.classList.contains('active-page');
    const hasSlot = ad.dataset.adSlot && ad.dataset.adSlot.trim();

    if (!wrapper || !isVisiblePage || !hasSlot || wrapper.offsetParent === null) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ad.dataset.momikoLoaded = 'true';
    } catch (error) {
      wrapper.dataset.adError = 'true';
    }
  });
}

// ==========================================
// 3. URLのハッシュ（#）による自動ページ切り替え（統合完全版）
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  hydrateMomikoAds(document);
  loadVisibleMomikoAds();

  let hash = window.location.hash;
  if (!hash) return;

  // 万が一、#の後ろに ?v=99 などが混ざっていたら綺麗に切り取る
  hash = hash.split('?')[0];

  let pageId = '';
  
  // ▼ ルール1：ページ内の特定要素（動画など）への直リンク判定
  const runeLinks = ['#page-rune-tier', '#rune-video', '#two-piece', '#attack-tier', '#defense-tier', '#explanation'];
  const abHeroLinks = ['#page-ab-hero', '#ab-hero-video'];
  const sHeroLinks = ['#page-s-hero', '#s-hero-video'];

  if (runeLinks.includes(hash)) {
    pageId = 'page-rune-tier';
  } else if (abHeroLinks.includes(hash)) {
    pageId = 'page-ab-hero';
  } else if (sHeroLinks.includes(hash)) {
    pageId = 'page-s-hero';
  } else if (hash === '#page-tier') {
    pageId = 'page-tier';
  } else if (hash === '#page-serial') {
    pageId = 'page-serial';
  }else if (hash === '#page-t2-equip') {
    pageId = 'page-t2-equip';
  }
  else {
    // ▼ ルール2：上記リストにない新しいページ（#page-member-catherineなど）は、#を消したものをそのままIDとする
    pageId = hash.replace('#', '');
  }

  // ▼ 判定したページへ切り替えを実行
  if (pageId) {
    const targetPage = document.getElementById(pageId);
    
    // ページが存在する場合のみ処理
    if (targetPage) {
      const targetMenu = document.querySelector(`[onclick*="${pageId}"]`);
      
      // ページ切り替え（switchPage関数が存在すれば実行、なければ予備処理）
      if (typeof switchPage === 'function') {
        switchPage(pageId, targetMenu);
      } else {
        document.querySelectorAll('.page-section').forEach(page => page.classList.remove('active-page'));
        targetPage.classList.add('active-page');
        if (targetMenu) {
          document.querySelectorAll('.channel-item').forEach(item => item.classList.remove('active'));
          targetMenu.classList.add('active');
        }
      }
      
      // 動画部分（#s-hero-videoなど）が指定されている場合は、そこへ少し遅れてスクロール
      if (hash !== '#' + pageId) {
        setTimeout(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300); // 画面の描画を待ってからスクロール
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const womenHeroes = [
    // 闇夜系
    { name: 'ロザリンド', faction: 'darknight', img: 'image/woman/darknight/rosalind_w.webp' },

    // 人系
    { name: '青瓷', faction: 'human', img: 'image/woman/human/seiji_w.webp' },

    // 獣族系
    { name: 'デシア', faction: 'beast', img: 'image/woman/beast/decia_w.webp' },

    // 精霊系
    { name: 'ソニア', faction: 'spirit', img: 'image/woman/spirit/sonia_w.webp' },

    // 神話系
    { name: 'ニックス', faction: 'mythology', img: 'image/woman/mythology/nyx_w.webp' },

    // 虚空系
    { name: 'スカイリー', faction: 'void', img: 'image/woman/void/skylie_w.webp' }
  ];

  const grid = document.getElementById('womenGalleryGrid');
  const buttons = document.querySelectorAll('.women-filter-tabs button');

  if (!grid) return;

  grid.innerHTML = womenHeroes.map(function (hero) {
    return `
      <article class="women-card" data-faction="${hero.faction}" title="${hero.name}">
        <img src="${hero.img}" alt="${hero.name}" loading="lazy">
      </article>
    `;
  }).join('');

  const cards = document.querySelectorAll('.women-card');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;

      buttons.forEach(function (btn) {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      cards.forEach(function (card) {
        const faction = card.dataset.faction;
        const isShow = filter === 'all' || faction === filter;
        card.classList.toggle('is-hidden', !isShow);
      });
    });
  });
});

// ==========================================
// 4. シリアルコードのコピー
// ==========================================
function copySerialCode(el) {
  const code = el.dataset.code;
  if (!code) return;

  function copiedUi() {
    el.classList.add('is-copied');

    setTimeout(function () {
      el.classList.remove('is-copied');
    }, 1200);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code).then(copiedUi).catch(function () {
      fallbackCopy(code, copiedUi);
    });
  } else {
    fallbackCopy(code, copiedUi);
  }
}

function fallbackCopy(text, callback) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    if (typeof callback === 'function') callback();
  } catch (e) {
    alert('クリップボードに入れられませんでした。手動で選択してください。');
  }

  document.body.removeChild(textarea);
}

// ==========================================
// 5. 動画サムネイルの再生
// ==========================================
function playSonixVideo(button) {
  const wrapper = button.parentElement;

  wrapper.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/PFd-nsqwu7E?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      title="ソニックス編成 徹底解説"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}
