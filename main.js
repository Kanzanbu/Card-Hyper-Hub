/* ── Active Nav Link ── */
(function setActiveNav() {
  const links = document.querySelectorAll('.navbar__links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href').split('?')[0];
    if (href === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
})();

/* ── Games Library: Filter by Difficulty ── */
(function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('#games-grid .game-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        b.style.borderColor = '';
        b.style.color = '';
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.style.borderColor = 'var(--color-accent)';
      btn.style.color = 'var(--color-accent)';

      // Show / hide cards
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.difficulty === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ── Strategy Page: Game Tabs ── */
(function initStrategyTabs() {
  const tabs  = document.querySelectorAll('.game-tab');
  if (!tabs.length) return;

  const strategies = {
    blackjack: {
      name: 'Blackjack',
      rows: [
        ['1 — Deal',       'Dealer deals 2 cards to each player and themselves (1 face-down)', 'Players see both their cards; dealer shows only 1',           'Note the dealer\'s upcard — it shapes every decision you\'ll make'],
        ['2 — Assess',     'Calculate your hand total',                                         'Face cards = 10; Aces = 1 or 11',                             'A soft hand (with Ace) gives you more flexibility — use it'],
        ['3 — Hit/Stand',  'Request another card (Hit) or keep your hand (Stand)',               'Exceeding 21 = bust, immediate loss',                        'Always hit on 11 or less. Always stand on 17 or more'],
        ['4 — Double',     'Double your bet and receive exactly one more card',                  'Only available on initial two-card hand',                     'Double on 10 or 11 when dealer shows a weak card (2–6)'],
        ['5 — Dealer',     'Dealer flips face-down card and hits until 17',                      'Dealer must stand on 17 or higher',                          'If dealer shows 2–6, they\'re likely to bust — don\'t overplay your hand'],
        ['6 — Resolve',    'Compare totals — highest without busting wins',                      'Blackjack (Ace + 10-value) pays 3:2',                        'Track wins and adjust bet sizing — never chase losses'],
      ]
    },
    poker: {
      name: 'Poker (Texas Hold\'em)',
      rows: [
        ['1 — Blinds',     'Small and big blinds post forced bets before the deal',              'Blinds rotate clockwise each hand',                          'Position is power — act last whenever possible'],
        ['2 — Pre-Flop',   'Each player receives 2 hole cards, betting round begins',            'Call, raise, or fold based on hand strength',                'Fold weak hands early. Premium hands: AA, KK, AK'],
        ['3 — Flop',       'Three community cards are dealt face-up',                            'All players share community cards',                          'If the flop doesn\'t improve your hand, be cautious about continuing'],
        ['4 — Turn',       'Fourth community card dealt, second betting round',                  'Pot odds now matter more for draws',                         'Count your outs and compare them to pot odds before calling'],
        ['5 — River',      'Fifth and final community card, last betting round',                  'Best 5-card hand from 7 available cards wins',               'Value bet strong hands; bluff sparingly and with purpose'],
        ['6 — Showdown',   'Remaining players reveal their hands',                               'Best 5-card combination wins the pot',                       'Show good hands confidently; muck weak bluffs to protect your image'],
      ]
    },
    rummy: {
      name: 'Rummy',
      rows: [
        ['1 — Deal',       '10 cards dealt to each player (2-player game)',                      'Remaining cards form the draw pile; one card face-up',       'Evaluate your hand for partial melds immediately on the deal'],
        ['2 — Draw',       'Draw one card from the deck or the discard pile',                    'You must take exactly one card',                             'Only take from discard if it completes or significantly helps a meld'],
        ['3 — Meld',       'Optionally lay down valid sets (3 of a kind) or runs (3 in sequence)', 'Sets: same rank; Runs: same suit, consecutive values',       'Don\'t rush to meld — holding cards can protect your strategy'],
        ['4 — Lay Off',    'Add cards to existing melds on the table',                           'Any player can lay off on any meld in play',                 'Watch opponents\' melds — laying off reduces deadwood points'],
        ['5 — Discard',    'End your turn by discarding one card face-up',                       'Cannot discard the card you just drew from the discard',     'Discard high-value cards you can\'t meld to minimize point loss'],
        ['6 — Gin/Win',    'First player to meld all cards (or knock) wins the round',           'Gin = no deadwood; Knock = ≤10 deadwood points',             'Going Gin earns a bonus. Only knock when you\'re confident it pays off'],
      ]
    },
    gofish: {
      name: 'Go Fish',
      rows: [
        ['1 — Deal',       '7 cards to each player (5 for 3+ players)',                          'Remaining cards form the central "ocean" pile',              'Mentally group your cards by rank immediately after dealing'],
        ['2 — Ask',        'On your turn, ask any opponent for a specific card rank',             'You must hold at least one card of the rank you\'re asking for', 'Ask for ranks you already have — matching increases your book chances'],
        ['3 — Get or Fish','If they have it, they give all of that rank. If not, "Go Fish" from the deck', 'Draw one card from the ocean if told to Go Fish',    'Remember what others asked for — it tells you what they hold'],
        ['4 — Books',      'When you have all 4 cards of a rank, lay them down as a book',       'Books score 1 point each',                                   'Prioritize collecting books over holding cards strategically'],
        ['5 — Continue',   'Play passes to the left; if you get the card asked for, take another turn', 'Consecutive turns are possible',                      'Chain your turns by asking strategically when you expect a yes'],
        ['6 — End',        'Game ends when all books are completed',                              'Player with the most books wins',                            'Track which books are complete to avoid wasting turns'],
      ]
    }
  };

  const zoneGameName  = document.getElementById('zone-game-name');
  const tableGameName = document.getElementById('table-game-name');
  const tbody         = document.getElementById('strategy-tbody');
  const tableEl       = document.getElementById('strategy-table');

  function loadGame(gameKey) {
    const data = strategies[gameKey];
    if (!data || !tbody) return;

    // Update labels
    if (zoneGameName)  zoneGameName.textContent  = `— ${data.name}`;
    if (tableGameName) tableGameName.textContent = `— ${data.name}`;
    if (tableEl) tableEl.setAttribute('aria-label', `${data.name} strategy table`);

    // Rebuild rows
    tbody.innerHTML = '';
    data.rows.forEach(([turn, action, rule, tip]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="turn-number">${turn}</td>
        <td>${action}</td>
        <td>${rule}</td>
        <td class="tip-cell">${tip}</td>
      `;
      tbody.appendChild(tr);
    });

    // Fade-in animation
    tbody.style.opacity = '0';
    setTimeout(() => { tbody.style.transition = 'opacity 300ms'; tbody.style.opacity = '1'; }, 50);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.style.borderColor = '';
        t.style.color = '';
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.style.borderColor = 'var(--color-accent)';
      tab.style.color = 'var(--color-accent)';
      loadGame(tab.dataset.game);
    });
  });

  // Load from URL param
  const params  = new URLSearchParams(window.location.search);
  const gameKey = params.get('game');
  if (gameKey && strategies[gameKey]) {
    const targetTab = document.querySelector(`.game-tab[data-game="${gameKey}"]`);
    if (targetTab) {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.style.borderColor = '';
        t.style.color = '';
      });
      targetTab.classList.add('active');
      targetTab.setAttribute('aria-selected', 'true');
      targetTab.style.borderColor = 'var(--color-accent)';
      targetTab.style.color = 'var(--color-accent)';
      loadGame(gameKey);
    }
  }
})();

/* ── Scroll Reveal (IntersectionObserver) ── */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.section-reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
})();

/* ── Recommendation Button ── */
(function initRecButton() {
  const btn = document.getElementById('get-recs-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();