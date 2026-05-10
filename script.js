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

document.addEventListener('DOMContentLoaded', function () {
  const boards = document.querySelectorAll('.beauty-tier-board');
  if (!boards.length) return;

  const heroes = [
    { rank: 1, name: 'デシア', top10: 92, favorite: 22, score: 202, img: 'image/hero/decia.webp' },
    { rank: 2, name: 'ニックス', top10: 98, favorite: 17, score: 183, img: 'image/hero/nyx.webp' },
    { rank: 3, name: 'ダフネ', top10: 54, favorite: 12, score: 114, img: 'image/hero/dafne.webp' },
    { rank: 4, name: '心蕙', top10: 51, favorite: 8, score: 91, img: 'image/hero/shinfi.webp' },
    { rank: 5, name: 'ソニア', top10: 47, favorite: 8, score: 87, img: 'image/hero/sonia.webp' },
    { rank: 6, name: 'ソフィア', top10: 31, favorite: 9, score: 76, img: 'image/hero/sofia.webp' },
    { rank: 7, name: '青瓷', top10: 43, favorite: 6, score: 73, img: 'image/hero/seiji.webp' },
    { rank: 8, name: 'ルビィ', top10: 19, favorite: 5, score: 44, img: 'image/hero/ruby.webp' },
    { rank: 9, name: 'セリーナ', top10: 20, favorite: 4, score: 40, img: 'image/hero/serina.webp' },
    { rank: 10, name: 'ナタリー', top10: 19, favorite: 4, score: 39, img: 'image/hero/natari.webp' },
    { rank: 11, name: 'スカイリー', top10: 38, favorite: 0, score: 38, img: 'image/hero/skylie.webp' },
    { rank: 12, name: 'ミラナ', top10: 19, favorite: 3, score: 34, img: 'image/hero/mirana.webp' },
    { rank: 13, name: 'アルバレス', top10: 18, favorite: 3, score: 33, img: 'image/hero/alvares.webp' },
    { rank: 14, name: 'フィリス', top10: 15, favorite: 2, score: 25, img: 'image/hero/fillis.webp' },
    { rank: 15, name: 'オリラ', top10: 10, favorite: 3, score: 25, img: 'image/hero/olira.webp' },
    { rank: 16, name: 'ロザリンド', top10: 22, favorite: 0, score: 22, img: 'image/hero/rozalind.webp' },
    { rank: 17, name: 'フェアリー', top10: 16, favorite: 1, score: 21, img: 'image/hero/fairy.webp' },
    { rank: 18, name: 'ソラ', top10: 19, favorite: 0, score: 19, img: 'image/hero/sora.webp' },
    { rank: 19, name: 'テア', top10: 16, favorite: 0, score: 16, img: 'image/hero/tea.webp' },
    { rank: 20, name: 'アリヤ', top10: 11, favorite: 1, score: 16, img: 'image/hero/ariya.webp' },
    { rank: 21, name: 'ペディア', top10: 8, favorite: 1, score: 13, img: 'image/hero/pedhia.webp' },
    { rank: 22, name: 'エルリニー', top10: 3, favorite: 2, score: 13, img: 'image/hero/elnriny.webp' },
    { rank: 23, name: '蛍火', top10: 12, favorite: 0, score: 12, img: 'image/hero/hotarubi.webp' },
    { rank: 24, name: '大荒蛮神', top10: 7, favorite: 1, score: 12, img: 'image/hero/banshin.webp' },
    { rank: 25, name: 'イソルド', top10: 10, favorite: 0, score: 10, img: 'image/hero/isolde.webp' },
    { rank: 26, name: 'アンタ', top10: 4, favorite: 1, score: 9, img: 'image/hero/anta.webp' },
    { rank: 27, name: 'シルサ', top10: 8, favorite: 0, score: 8, img: 'image/hero/shirusa.webp' },
    { rank: 28, name: 'カリスト', top10: 7, favorite: 0, score: 7, img: 'image/hero/karist.webp' },
    { rank: 29, name: 'ヴァルキリー', top10: 7, favorite: 0, score: 7, img: 'image/hero/valkyrie.webp' },
    { rank: 30, name: 'クティーラ', top10: 2, favorite: 1, score: 7, img: 'image/hero/kuthira.webp' },
    { rank: 31, name: 'キーラ', top10: 6, favorite: 0, score: 6, img: 'image/hero/kira.webp' },
    { rank: 32, name: 'デニス', top10: 6, favorite: 0, score: 6, img: 'image/hero/denis.webp' },
    { rank: 33, name: 'モニカ', top10: 6, favorite: 0, score: 6, img: 'image/hero/monica.webp' },
    { rank: 34, name: 'ライランドール', top10: 6, favorite: 0, score: 6, img: 'image/hero/rairandoll.webp' },
    { rank: 35, name: 'アヴィリア', top10: 5, favorite: 0, score: 5, img: 'image/hero/aviria.webp' },
    { rank: 36, name: 'ノエミ', top10: 5, favorite: 0, score: 5, img: 'image/hero/noemi.webp' },
    { rank: 37, name: 'ケイン', top10: 0, favorite: 1, score: 5, img: 'image/hero/kein.webp', tag: 'ネタ枠' },
    { rank: 38, name: '災厄', top10: 0, favorite: 1, score: 5, img: 'image/hero/saiyaku.webp', tag: 'ネタ枠' },
    { rank: 39, name: 'カトリーヌ', top10: 4, favorite: 0, score: 4, img: 'image/hero/katorinu.webp' },
    { rank: 40, name: 'ロンカカ', top10: 4, favorite: 0, score: 4, img: 'image/hero/ronkaka.webp' },
    { rank: 41, name: 'マファータ', top10: 3, favorite: 0, score: 3, img: 'image/hero/mafata.webp' },
    { rank: 42, name: 'マリッサ', top10: 3, favorite: 0, score: 3, img: 'image/hero/marissa.webp' },
    { rank: 43, name: 'ミス', top10: 3, favorite: 0, score: 3, img: 'image/hero/miss.webp' },
    { rank: 44, name: '生の女神', top10: 3, favorite: 0, score: 3, img: 'image/hero/seinomegami.webp' },
    { rank: 45, name: 'アヴィ', top10: 2, favorite: 0, score: 2, img: 'image/hero/avi.webp' },
    { rank: 46, name: 'クリスタ', top10: 2, favorite: 0, score: 2, img: 'image/hero/crista.webp' },
    { rank: 47, name: 'サとミ', top10: 2, favorite: 0, score: 2, img: 'image/hero/satomi.webp' },
    { rank: 48, name: 'イルビダ', top10: 1, favorite: 0, score: 1, img: 'image/hero/ilvida.webp' },
    { rank: 49, name: 'ケリディア', top10: 1, favorite: 0, score: 1, img: 'image/hero/keridhia.webp' },
    { rank: 50, name: 'セシーナ', top10: 1, favorite: 0, score: 1, img: 'image/hero/sesina.webp' },
    { rank: 51, name: 'ニコル', top10: 1, favorite: 0, score: 1, img: 'image/hero/nicol.webp' },
    { rank: 52, name: '海洋の姫', top10: 1, favorite: 0, score: 1, img: 'image/hero/kaiyounohime.webp' },
    { rank: 58, name: 'フェニックス', top10: 0, favorite: 0, score: 0, img: 'image/hero/fenix.webp' },
    { rank: 61, name: '輪廻の神', top10: 0, favorite: 0, score: 0, img: 'image/hero/rinne.webp' },
    { rank: 53, name: 'オディナ', top10: 0, favorite: 0, score: 0, img: 'image/hero/odina.webp' },
    { rank: 54, name: 'キャリー', top10: 0, favorite: 0, score: 0, img: 'image/hero/carry.webp' },
    { rank: 55, name: 'キルメイン', top10: 0, favorite: 0, score: 0, img: 'image/hero/killmain.webp' },
    { rank: 56, name: 'セリーナ2', top10: 0, favorite: 0, score: 0, img: 'image/hero/serina2.webp' },
    { rank: 57, name: 'ファリネッリ', top10: 0, favorite: 0, score: 0, img: 'image/hero/farineri.webp' },
    { rank: 59, name: 'レインボー', top10: 0, favorite: 0, score: 0, img: 'image/hero/rainbow.webp' },
    { rank: 60, name: 'レニカ', top10: 0, favorite: 0, score: 0, img: 'image/hero/renica.webp' }
  ];

  const tiers = [
    { key: 't0', label: 'T0', filter: (hero) => hero.rank <= 3 },
    { key: 't1', label: 'T1', filter: (hero) => (hero.rank >= 4 && hero.score >= 40) || hero.name === 'ナタリー' },
    { key: 't15', label: 'T1.5', filter: (hero) => hero.name !== 'ナタリー' && hero.score >= 10 && hero.score <= 39 },
    { key: 't2', label: 'T2', filter: (hero) => hero.score >= 5 && hero.score <= 9 },
    { key: 't3', label: 'T3', filter: (hero) => hero.score >= 1 && hero.score <= 4 },
    { key: 't4', label: 'T4', filter: (hero) => hero.score === 0 }
  ];

  function heroCard(hero) {
    const tag = hero.tag ? `<span class="beauty-tier-tag">${hero.tag}</span>` : '';
    return `
      <article class="beauty-tier-card">
        <span class="beauty-tier-rank">${hero.rank}</span>
        <img src="${hero.img}" alt="${hero.name}" loading="lazy">
        <div class="beauty-tier-name">${hero.name}${tag}</div>
        <div class="beauty-tier-score">${hero.score}pt <span>TOP10:${hero.top10} / 最推し:${hero.favorite}</span></div>
      </article>
    `;
  }

  boards.forEach(function (board) {
    board.innerHTML = tiers.map(function (tier) {
      const tierHeroes = heroes.filter(tier.filter).map(heroCard).join('');
      return `
        <section class="beauty-tier-row beauty-tier-${tier.key}">
          <div class="beauty-tier-label">
            <strong>${tier.label}</strong>
          </div>
          <div class="beauty-tier-list">${tierHeroes}</div>
        </section>
      `;
    }).join('');
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

  document.addEventListener('click', function (e) {
    const button = e.target.closest('.flas-youtube-lite');
    if (!button) return;

    const videoId = button.dataset.youtubeId;
    const start = button.dataset.start || 0;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&rel=0&modestbranding=1`;
    iframe.title = 'フラス護衛隊 解説動画';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    button.replaceWith(iframe);
  });
