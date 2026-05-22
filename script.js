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

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
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
      const menuHrefByPage = {
        'page-tier': 'tier.html',
        'page-rune-tier': 'rune.html',
        'page-s-hero': 's-hero.html',
        'growth-priority': 'growth-priority.html',
        'page-serial': 'serial.html',
        'page-beauty-ranking': 'beauty-ranking.html'
      };
      const targetMenu = document.querySelector(`[onclick*="${pageId}"]`) ||
        document.querySelector(`[href="${menuHrefByPage[pageId]}"]`);
      
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

  const baseHeroes = [
    { name: 'デシア', top10: 93, favorite: 22, img: 'image/hero/decia.webp' },
    { name: 'ニックス', top10: 99, favorite: 17, img: 'image/hero/nyx.webp' },
    { name: 'ダフネ', top10: 54, favorite: 12, img: 'image/hero/dafne.webp' },
    { name: '心蕙', top10: 52, favorite: 8, img: 'image/hero/shinfi.webp' },
    { name: 'ソニア', top10: 48, favorite: 8, img: 'image/hero/sonia.webp' },
    { name: 'ソフィア', top10: 31, favorite: 9, img: 'image/hero/sofia.webp' },
    { name: '青瓷', top10: 43, favorite: 6, img: 'image/hero/seiji.webp' },
    { name: 'ルビィ', top10: 19, favorite: 5, img: 'image/hero/ruby.webp' },
    { name: 'セリーナ', top10: 20, favorite: 4, img: 'image/hero/serina.webp' },
    { name: 'スカイリー', top10: 39, favorite: 0, img: 'image/hero/skylie.webp' },
    { name: 'ナタリー', top10: 19, favorite: 4, img: 'image/hero/natari.webp' },
    { name: 'ミラナ', top10: 19, favorite: 3, img: 'image/hero/mirana.webp' },
    { name: 'アルバレス', top10: 18, favorite: 3, img: 'image/hero/alvares.webp' },
    { name: 'フィリス', top10: 15, favorite: 2, img: 'image/hero/fillis.webp' },
    { name: 'オリラ', top10: 10, favorite: 3, img: 'image/hero/olira.webp' },
    { name: 'ソラ', top10: 19, favorite: 1, img: 'image/hero/sora.webp' },
    { name: 'ロザリンド', top10: 22, favorite: 0, img: 'image/hero/rozalind.webp' },
    { name: 'フェアリー', top10: 16, favorite: 1, img: 'image/hero/fairy.webp' },
    { name: 'テア', top10: 16, favorite: 0, img: 'image/hero/tea.webp' },
    { name: 'アリヤ', top10: 11, favorite: 1, img: 'image/hero/ariya.webp' },
    { name: 'ペディア', top10: 9, favorite: 1, img: 'image/hero/pedhia.webp' },
    { name: 'エルリニー', top10: 3, favorite: 2, img: 'image/hero/elnriny.webp' },
    { name: '蛍火', top10: 12, favorite: 0, img: 'image/hero/hotarubi.webp' },
    { name: '大荒蛮神', top10: 7, favorite: 1, img: 'image/hero/banshin.webp' },
    { name: 'イソルド', top10: 10, favorite: 0, img: 'image/hero/isolde.webp' },
    { name: 'アンタ', top10: 4, favorite: 1, img: 'image/hero/anta.webp' },
    { name: 'シルサ', top10: 8, favorite: 0, img: 'image/hero/shirusa.webp' },
    { name: 'ヴァルキリー', top10: 8, favorite: 0, img: 'image/hero/valkyrie.webp' },
    { name: 'カリスト', top10: 7, favorite: 0, img: 'image/hero/karist.webp' },
    { name: 'クティーラ', top10: 2, favorite: 1, img: 'image/hero/kuthira.webp' },
    { name: 'キーラ', top10: 6, favorite: 0, img: 'image/hero/kira.webp' },
    { name: 'デニス', top10: 6, favorite: 0, img: 'image/hero/denis.webp' },
    { name: 'モニカ', top10: 6, favorite: 0, img: 'image/hero/monica.webp' },
    { name: 'ライランドール', top10: 6, favorite: 0, img: 'image/hero/rairandoll.webp' },
    { name: 'アヴィリア', top10: 5, favorite: 0, img: 'image/hero/aviria.webp' },
    { name: 'ノエミ', top10: 5, favorite: 0, img: 'image/hero/noemi.webp' },
    { name: 'ケイン', top10: 0, favorite: 1, img: 'image/hero/kein.webp', tag: 'ネタ枠' },
    { name: '災厄', top10: 0, favorite: 1, img: 'image/hero/saiyaku.webp', tag: 'ネタ枠' },
    { name: 'カトリーヌ', top10: 4, favorite: 0, img: 'image/hero/katorinu.webp' },
    { name: 'ロンカカ', top10: 4, favorite: 0, img: 'image/hero/ronkaka.webp' },
    { name: '生の女神', top10: 4, favorite: 0, img: 'image/hero/seinomegami.webp' },
    { name: 'マファータ', top10: 3, favorite: 0, img: 'image/hero/mafata.webp' },
    { name: 'マリッサ', top10: 3, favorite: 0, img: 'image/hero/marissa.webp' },
    { name: 'ミス', top10: 3, favorite: 0, img: 'image/hero/miss.webp' },
    { name: 'アヴィ', top10: 2, favorite: 0, img: 'image/hero/avi.webp' },
    { name: 'クリスタ', top10: 2, favorite: 0, img: 'image/hero/crista.webp' },
    { name: 'サとミ', top10: 2, favorite: 0, img: 'image/hero/satomi.webp' },
    { name: 'イルビダ', top10: 1, favorite: 0, img: 'image/hero/ilvida.webp' },
    { name: 'ケリディア', top10: 1, favorite: 0, img: 'image/hero/keridhia.webp' },
    { name: 'セシーナ', top10: 1, favorite: 0, img: 'image/hero/sesina.webp' },
    { name: 'ニコル', top10: 1, favorite: 0, img: 'image/hero/nicol.webp' },
    { name: '海洋の姫', top10: 1, favorite: 0, img: 'image/hero/kaiyounohime.webp' },
    { name: 'フェニックス', top10: 0, favorite: 0, img: 'image/hero/fenix.webp' },
    { name: '輪廻の神', top10: 0, favorite: 0, img: 'image/hero/rinenokami.webp' },
    { name: 'オディナ', top10: 0, favorite: 0, img: 'image/hero/odina.webp' },
    { name: 'キャリー', top10: 0, favorite: 0, img: 'image/hero/carry.webp' },
    { name: 'キルメイン', top10: 0, favorite: 0, img: 'image/hero/killmain.webp' },
    { name: 'セリーナ2', top10: 0, favorite: 0, img: 'image/hero/serina2.webp' },
    { name: 'ファリネッリ', top10: 0, favorite: 0, img: 'image/hero/farineri.webp' },
    { name: 'レインボー', top10: 0, favorite: 0, img: 'image/hero/rainbow.webp' },
    { name: 'レニカ', top10: 0, favorite: 0, img: 'image/hero/renica.webp' }
  ];

  let previousScore = null;
  let previousRank = 0;
  const heroes = baseHeroes
    .map(function (hero, index) {
      return Object.assign({}, hero, {
        order: index,
        score: hero.top10 + hero.favorite * 5
      });
    })
    .sort(function (a, b) {
      return b.score - a.score || a.order - b.order;
    })
    .map(function (hero, index) {
      const rank = previousScore === hero.score ? previousRank : index + 1;
      previousScore = hero.score;
      previousRank = rank;
      return Object.assign(hero, { rank: rank });
    });

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

  function summaryCard(hero, index) {
    const rankClass = index < 3 ? ` rank-${index + 1}` : '';
    const pickup = hero.favorite > 0 ? `最推し${hero.favorite}票` : `TOP10票${hero.top10}票`;
    return `
      <article class="beauty-summary-card${rankClass}">
        <span class="beauty-summary-img"><img src="${hero.img}" alt="${hero.name}" loading="lazy"></span>
        <div>
          <div class="beauty-summary-rank">第${hero.rank}位</div>
          <div class="beauty-summary-name">${hero.name}</div>
          <div class="beauty-summary-score">${hero.score}pt / ${pickup}</div>
        </div>
      </article>
    `;
  }

  function tableRow(hero) {
    const topClass = hero.rank <= 3 ? ' top' : '';
    const top10Class = hero.top10 === 0 ? ' class="beauty-muted"' : '';
    const favoriteClass = hero.favorite === 0 ? ' class="beauty-muted"' : '';
    const tag = hero.tag ? `<span class="beauty-tag">${hero.tag}</span>` : '';
    return `
      <tr>
        <td class="beauty-rank${topClass}">${hero.rank}</td>
        <td><div class="beauty-hero-cell"><span class="beauty-table-img"><img src="${hero.img}" alt="${hero.name}" loading="lazy"></span><span class="beauty-hero-name">${hero.name}${tag}</span></div></td>
        <td${top10Class}>${hero.top10}</td>
        <td${favoriteClass}>${hero.favorite}</td>
        <td class="beauty-score">${hero.score}</td>
      </tr>
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

  document.querySelectorAll('.beauty-ranking-summary').forEach(function (summary) {
    summary.innerHTML = heroes.slice(0, 3).map(summaryCard).join('');
  });

  document.querySelectorAll('.beauty-ranking-table tbody').forEach(function (tbody) {
    tbody.innerHTML = heroes.map(tableRow).join('');
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
