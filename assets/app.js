/* Southwest Wildcats U22 Elite website.
   You should not need to edit this file to update the site.
   Everything that changes (players, coaches, alumni, games, sponsors) lives in the /data folder.
   See HOW-TO-UPDATE.md. */
(function () {
  "use strict";

  var DATA_FILES = ["team", "players", "coaches", "alumni", "games", "sponsors"];
  var D = {};
  var ui = { rosterFilter: "all", aboutPlayer: "", album: "" };

  var NAV = [
    ["home", "Home"],
    ["roster", "Roster"],
    ["coaches", "Coaches"],
    ["alumni", "Alumni & PWHL"],
    ["schedule", "Schedule"],
    ["sponsors", "Sponsors"],
    ["recruiting", "Recruiting"],
    ["gallery", "Gallery"]
  ];
  var POS = { F: "Forward", D: "Defence", G: "Goalie" };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function preview() { return !!(D.team && D.team.previewMode); }
  function checkBadge(note) {
    if (!preview()) return "";
    return ' <span class="check" title="' + esc(note || "Needs checking before launch") + '">CHECK</span>';
  }
  function visible(item) { return !item.check || preview(); }
  function ext(url, label) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
  }
  function fullName(p) { return (p.firstName + " " + p.lastName).trim(); }
  function num(p) { return p.number !== "" && p.number != null ? "#" + p.number : "#00"; }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : new Date(s);
  }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function time12(d) {
    var h = d.getHours(), m = d.getMinutes();
    return ((h % 12) || 12) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " AM" : " PM");
  }
  function photoBox(src, label, cls, ghost) {
    if (src) return '<div class="' + cls + '"><img src="' + esc(src) + '" alt="' + esc(label) + '" loading="lazy"></div>';
    return '<div class="' + cls + ' ph" aria-label="Photo coming soon">' +
      (ghost ? '<span class="num-ghost">' + esc(ghost) + "</span>" : "Photo coming soon") + "</div>";
  }

  /* ---------- shell ---------- */
  function shell() {
    var t = D.team;
    var bar = preview()
      ? '<div class="preview-bar"><div class="wrap"><strong>Mock-up for review.</strong>' +
        "<span>Coach photos are coming soon.</span>" +
        '<span><span class="check">CHECK</span> = not confirmed yet; hidden on the live site.</span></div></div>'
      : "";
    var links = NAV.map(function (n) {
      return '<li><a href="#' + n[0] + '" data-nav="' + n[0] + '">' + esc(n[1]) + "</a></li>";
    }).join("");
    document.getElementById("app").innerHTML =
      bar +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="#home"><span class="crest-logo"><img src="assets/logo-small.png" alt="Wildcats logo" width="62" height="45"></span>' +
      '<span class="brand-text"><b>' + esc(t.teamName) + "</b><span>" + esc(t.division) + " · " + esc(t.season) + "</span></span></a>" +
      '<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + "</ul></nav>" +
      "</div></header>" +
      '<main id="main"></main>' +
      footer();
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  function credit() {
    var t = D.team;
    if (!t.mediaCredit) return "";
    return '<p class="media-credit">' + esc(t.mediaCredit) + (t.mediaCreditUrl ? " " + ext(t.mediaCreditUrl, t.mediaCreditName || "Visit their page") : "") + "</p>";
  }
  function footer() {
    var t = D.team, L = t.links;
    return '<footer class="site-footer"><div class="wrap">' +
      '<div class="stack"><h3>' + esc(t.teamName) + " " + esc(t.division) + "</h3><p>" + esc(t.league) +
      ". Part of the " + ext(L.association, t.association) + ".</p><p>Founded " + esc(t.founded) + ". Windsor-Essex, Ontario.</p>" + credit() + "</div>" +
      '<div><h3>Follow</h3><ul><li>' + ext(L.youtube, "YouTube: live home games") + "</li><li>" +
      ext(L.instagram, "Instagram @swwildcats") + "</li><li>" + ext(L.officialSchedule, "Official schedule and scores") + "</li></ul></div>" +
      '<div><h3>Contact</h3><ul><li><a href="#recruiting">Players and scouts</a></li><li><a href="#sponsors">Become a sponsor</a></li>' +
      "<li>" + (t.contactEmail ? '<a href="mailto:' + esc(t.contactEmail) + '">' + esc(t.contactEmail) + "</a>" : '<span class="muted">Team email to come</span>' + checkBadge("Add the team email address in data/team.json")) + "</li></ul></div>" +
      "</div></footer>";
  }

  /* ---------- pages ---------- */
  function upcomingGames() {
    var now = new Date();
    return D.games.map(function (g) { return Object.assign({ d: parseDate(g.date) }, g); })
      .filter(function (g) { return g.d >= now; })
      .sort(function (a, b) { return a.d - b.d; });
  }

  function rinkArt() {
    return '<svg viewBox="0 0 400 300" aria-hidden="true">' +
      '<rect x="0" y="0" width="400" height="300" fill="#1A1A1C"/>' +
      '<rect x="18" y="18" width="364" height="264" rx="70" fill="#F4F3F3" opacity="0.06" stroke="#F4F3F3" stroke-opacity="0.35" stroke-width="2"/>' +
      '<line x1="200" y1="18" x2="200" y2="282" stroke="#A52C33" stroke-width="6"/>' +
      '<line x1="60" y1="18" x2="60" y2="282" stroke="#A52C33" stroke-width="2" opacity="0.8"/>' +
      '<line x1="340" y1="18" x2="340" y2="282" stroke="#A52C33" stroke-width="2" opacity="0.8"/>' +
      '<circle cx="200" cy="150" r="62" fill="#FFFFFF" stroke="#A52C33" stroke-width="4"/>' +
      '<image href="assets/logo-small.png" x="148" y="113" width="104" height="76" preserveAspectRatio="xMidYMid meet"/>' +
      '<circle cx="110" cy="85" r="34" fill="none" stroke="#A52C33" stroke-opacity="0.75" stroke-width="2"/>' +
      '<circle cx="110" cy="215" r="34" fill="none" stroke="#A52C33" stroke-opacity="0.75" stroke-width="2"/>' +
      '<circle cx="290" cy="85" r="34" fill="none" stroke="#A52C33" stroke-opacity="0.75" stroke-width="2"/>' +
      '<circle cx="290" cy="215" r="34" fill="none" stroke="#A52C33" stroke-opacity="0.75" stroke-width="2"/>' +
      '<circle cx="110" cy="85" r="4" fill="#A52C33"/><circle cx="110" cy="215" r="4" fill="#A52C33"/>' +
      '<circle cx="290" cy="85" r="4" fill="#A52C33"/><circle cx="290" cy="215" r="4" fill="#A52C33"/>' +
      '<path d="M40 128 a22 22 0 0 1 0 44" fill="#A52C33" fill-opacity="0.25" stroke="#A52C33" stroke-width="2"/>' +
      '<path d="M360 128 a22 22 0 0 0 0 44" fill="#A52C33" fill-opacity="0.25" stroke="#A52C33" stroke-width="2"/>' +
      "</svg>";
  }

  function pageHome() {
    var t = D.team, ci = D.alumni.campInvites;
    var next = upcomingGames()[0];
    var nextHtml = next
      ? '<div class="gameday"><div class="date-block"><span class="mon">' + MON[next.d.getMonth()] + '</span><span class="day">' + next.d.getDate() + "</span></div>" +
        '<div class="opp">' + (next.home ? "vs " : "at ") + esc(next.opponent) + "</div>" +
        '<div class="muted">' + DOW[next.d.getDay()] + " " + time12(next.d) + " · " + esc(next.rink) + "</div></div>"
      : '<p class="muted">No upcoming games in the list. See the official schedule.</p>';
    var invites = ci.players.filter(visible).map(function (p) {
      return '<div class="invite"><span class="eyebrow">Invited to camp</span><div class="camp">' + (p.logo ? '<img class="camp-logo" src="' + esc(p.logo) + '" alt="' + esc(p.camp) + ' logo">' : "") + esc(p.camp) + (p.check ? checkBadge(p.checkNote) : "") + "</div>" +
        '<div class="who">' + esc(p.name) + ' <span class="muted">· ' + esc(p.hometown) + "</span></div></div>";
    }).join("");
    var staffList = D.coaches.filter(function (c) { return !c.noPhoto && (!c.nameCheck || preview()); });

    var tp = t.teamPhoto || {};
    return '<section class="hero' + (tp.image ? " has-photo" : "") + '"><div class="wrap">' +
      '<div class="stack"><span class="eyebrow">' + esc(t.league) + " · Since " + esc(t.founded) + "</span>" +
      "<h1>" + esc(t.teamName) + " <em>" + esc(t.division) + "</em></h1>" +
      "<p>" + esc(t.tagline) + " " + esc(t.intro) + "</p>" +
      '<div class="btn-row"><a class="btn" href="#roster">Meet the roster</a><a class="btn ghost" href="#alumni">See where our alumni play</a></div></div>' +
      (tp.image ? "" : '<div class="hero-art">' + rinkArt() + (preview() ? '<div class="ph">Team photo goes here</div>' : "") + "</div>") +
      "</div>" + (tp.image ? '<figure class="team-photo"><img src="' + esc(tp.image) + '" alt="' + esc(tp.alt || "Team photo") + '"></figure>' : "") +
      '<div class="hero-stripe" aria-hidden="true"></div></section>' +

      watchSection() +

      '<section class="section alt"><div class="wrap"><div class="section-title"><h2>' + esc(ci.title) + "</h2>" +
      '<a href="#alumni">All alumni</a></div><div class="invite-list">' + invites + "</div>" +
      '<div class="btn-row" style="margin-top:1.25rem"><a class="btn" href="#alumni">See all Wildcats alumni</a></div>' +
      '<p class="muted" style="margin-top:1rem;font-size:.875rem">Source: ' + ext(ci.source, ci.sourceLabel) + ".</p></div></section>" +

      groupSection(t.leadership, "Leadership team", "On and off the ice") +
      groupSection(t.seniors, "2027 Seniors", "Our graduating class", true) +

      '<section class="section"><div class="wrap"><div class="home-grid">' +
      '<div class="panel"><span class="eyebrow">Next game</span>' + nextHtml +
      '<div class="btn-row"><a class="btn outline" href="#schedule">Full schedule</a></div></div>' +
      '<div class="panel dark"><span class="eyebrow">Wildcats alumni</span><h3>From our ice to the NCAA, U Sports and the PWHL</h3>' +
      '<p class="muted">See where former Wildcats play now, including three 2026-27 PWHL camp invites.</p><div class="btn-row"><a class="btn" href="#alumni">See our alumni</a></div></div>' +
      '<div class="panel"><span class="eyebrow">Play for the Wildcats</span><h3>Players, parents and scouts</h3>' +
      '<p class="muted">Ask about tryouts, request player profiles or game times.</p><div class="btn-row"><a class="btn" href="#recruiting">Get in touch</a></div>' +
      (D.team.contactEmail ? '<p class="muted" style="margin-top:.75rem">Or email <a href="mailto:' + esc(D.team.contactEmail) + '">' + esc(D.team.contactEmail) + "</a></p>" : "") + "</div>" +
      "</div></div></section>" +

      recentGameSection() +
      statsSection() +
      instaSection() +


      '<section class="section"><div class="wrap two-col"><div class="stack"><span class="eyebrow">Our coaches</span><h2>Experience behind the bench</h2></div>' +
      '<div class="stack"><p>Our staff brings NCAA Division I hockey, professional hockey, university athletics and specialist goalie coaching.</p>' +
      staffList.map(function (c) { return "<p><strong>" + esc(c.role) + " " + esc(c.name) + ".</strong> " + esc(c.tagline || "") + "</p>"; }).join("") +
      '<div class="btn-row"><a class="btn outline" href="#coaches">Meet the staff</a></div></div></div></section>' +

      sponsorStrip();
  }

  function watchSection() {
    var t = D.team, r = t.reel;
    if (!r || !r.video) return "";
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var extra = (t.featuredVideos || []).map(function (v) {
      return '<li><a href="' + esc(v.url) + '" target="_blank" rel="noopener">&#9654; ' + esc(v.title) + "</a></li>";
    }).join("");
    return '<section class="watch"><div class="wrap watch-grid">' +
      '<a class="reel" href="' + esc(t.links.youtube) + '" target="_blank" rel="noopener" aria-label="Watch the Wildcats on YouTube">' +
      '<video src="' + esc(r.video) + '" poster="' + esc(r.poster) + '" muted loop playsinline' + (still ? "" : " autoplay") + ' preload="metadata"></video>' +
      '<span class="reel-cta">&#9654; Watch on YouTube</span></a>' +
      '<div class="stack"><span class="eyebrow">Watch the Wildcats</span><h2>Every home game, live</h2>' +
      "<p>" + esc(t.streamCredit || "Home games stream live on the team YouTube channel.") + "</p>" +
      (extra ? '<ul class="clip-list">' + extra + "</ul>" : "") +
      '<div class="btn-row"><a class="btn" href="' + esc(t.links.youtube) + '" target="_blank" rel="noopener">Go to our YouTube channel</a>' +
      '<a class="btn ghost" href="' + esc(t.links.instagram) + '" target="_blank" rel="noopener">Instagram @swwildcats</a></div>' +
      (r.caption ? '<p class="muted" style="font-size:.875rem">' + esc(r.caption) + "</p>" : "") +
      "</div></div></section>";
  }

  function groupSection(g, eyebrow, fallbackTitle, flip) {
    g = g || {};
    var members = (g.members || []).map(function (m) {
      var p = D.players.filter(function (x) { return x.id === m.id; })[0];
      return p ? { p: p, role: m.role || "" } : null;
    }).filter(Boolean);
    if (!g.image && !members.length && !preview()) return "";
    var pic = g.image ? '<img src="' + esc(g.image) + '" alt="' + esc(g.alt || eyebrow) + '" loading="lazy">' : '<div class="ph">' + esc(eyebrow) + " photo</div>";
    var list = members.length ? '<ul class="group-list">' + members.map(function (m) {
      return '<li><a href="#' + esc(m.p.id) + '"><span class="num">#' + esc(m.p.number) + "</span> " + esc(fullName(m.p)) + "</a>" +
        (m.role ? ' <span class="muted">· ' + esc(m.role) + "</span>" : "") + "</li>";
    }).join("") + "</ul>" : (preview() ? '<p class="muted">Names go here.</p>' : "");
    var text = '<div class="stack"><span class="eyebrow">' + esc(eyebrow) + "</span><h2>" + esc(g.title || fallbackTitle) + "</h2>" +
      (g.intro ? "<p>" + esc(g.intro) + "</p>" : "") + list + "</div>";
    var fig = '<figure class="group-photo">' + pic + "</figure>";
    return '<section class="section' + (flip ? " alt" : "") + '"><div class="wrap two-col group">' + (flip ? text + fig : fig + text) + "</div></section>";
  }

  function statsSection() {
    var st = D.team.liveStats || {};
    if (!st.url) return "";
    return '<section class="section" style="padding-top:1.5rem;padding-bottom:1.5rem"><div class="wrap">' +
      '<p style="margin:0;font-size:1.35rem;font-weight:600"><strong style="text-transform:uppercase;letter-spacing:.03em">Team stats:</strong> <a href="' + esc(st.url) + '" target="_blank" rel="noopener">See Wildcats stats on the ' + esc(st.label || "league") + ' site</a></p></div></section>';
  }

  function recentGameSection() {
    var g = D.team.recentGame || {};
    if (!g.image && !g.youtubeId && !preview()) return "";
    var pic = g.youtubeId ? '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(g.youtubeId) + "?start=" + (g.start || 0) + (g.end ? "&end=" + g.end : "") + '&rel=0" title="' + esc(g.title || "Game highlight") + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
      : g.image ? '<img src="' + esc(g.image) + '" alt="' + esc(g.title || "Recent game photo") + '" loading="lazy">' : '<div class="ph">Game photo</div>';
    var link = g.link ? '<div class="btn-row"><a class="btn outline" href="' + esc(g.link) + '" target="_blank" rel="noopener">' + esc(g.linkLabel || "Watch the game") + "</a></div>" : "";
    return '<section class="section alt"><div class="wrap two-col"><div class="stack"><span class="eyebrow">Game highlights' + (g.date ? " &middot; " + esc(g.date) : "") + "</span>" +
      "<h2>" + esc(g.title || "From our latest game") + "</h2>" +
      (g.caption ? "<p>" + esc(g.caption) + "</p>" : '<p class="muted">' + (preview() ? "A photo from a recent game goes here, with a line about the moment." : "") + "</p>") +
      link + '</div><figure class="game-photo">' + pic + "</figure></div></section>";
  }

  function instaSection() {
    var t = D.team, ig = t.instagramLatest || {};
    if (!ig.url && !preview()) return "";
    var href = ig.url || t.links.instagram;
    var pic = ig.image ? '<img src="' + esc(ig.image) + '" alt="Latest Instagram post" loading="lazy">' : '<div class="ph">Latest post image</div>';
    return '<section class="section"><div class="wrap two-col"><a class="insta-card" href="' + esc(href) + '" target="_blank" rel="noopener">' + pic +
      '<span class="insta-bar"><b>@swwildcats</b><span>View on Instagram &rarr;</span></span></a>' +
      '<div class="stack"><span class="eyebrow">Latest on Instagram</span><h2>Game days, team news and shout-outs</h2>' +
      (ig.caption ? "<p>" + esc(ig.caption) + "</p>" : '<p class="muted">' + (preview() ? "The newest team post goes here. Tap it to open the post on Instagram." : "") + "</p>") +
      '<div class="btn-row"><a class="btn" href="' + esc(t.links.instagram) + '" target="_blank" rel="noopener">Follow @swwildcats</a></div></div></div></section>';
  }

  function sponsorStrip() {
    var list = D.sponsors.filter(visible);
    var tiles = list.map(logoTile).join("");
    return '<section class="section alt"><div class="wrap"><div class="section-title"><h2>Thank you to our sponsors</h2><a href="#sponsors">Become a sponsor</a></div>' +
      '<div class="logo-grid">' + tiles + "</div></div></section>";
  }
  function logoTile(s) {
    var inner = s.logo ? '<img src="' + esc(s.logo) + '" alt="' + esc(s.name) + '">' : '<span class="nm">' + esc(s.name) + "</span>";
    if (s.check) inner += checkBadge(s.note);
    return s.website
      ? '<a class="logo-tile" href="' + esc(s.website) + '" target="_blank" rel="noopener">' + inner + "</a>"
      : '<div class="logo-tile">' + inner + "</div>";
  }

  function pageHead(eyebrow, title, text) {
    return '<section class="page-head"><div class="wrap"><span class="eyebrow">' + esc(eyebrow) + "</span><h1>" + esc(title) + "</h1>" +
      (text ? "<p>" + text + "</p>" : "") + "</div></section>";
  }

  function pageRoster() {
    var ps = D.players.filter(function (p) { return ui.rosterFilter === "all" || p.position === ui.rosterFilter; })
      .slice().sort(function (a, b) { return (parseInt(a.number, 10) || 999) - (parseInt(b.number, 10) || 999); });
    var anyPh = D.players.some(function (p) { return p.placeholder; });
    var chips = [["all", "All"], ["F", "Forwards"], ["D", "Defence"], ["G", "Goalies"]].map(function (c) {
      return '<button class="chip" data-filter="' + c[0] + '" aria-pressed="' + (ui.rosterFilter === c[0]) + '">' + c[1] + "</button>";
    }).join("");
    var cards = ps.map(function (p) {
      return '<a class="card" href="#' + esc(p.id) + '">' + photoBox(p.photo, fullName(p), "photo", p.photo ? "" : num(p)) +
        (p.introVideo ? '<span class="play-chip" aria-hidden="true">&#9654; Intro</span>' : "") +
        '<div class="info"><div class="num-line"><span class="num">' + esc(num(p)) + "</span>" + (p.numberCheck ? checkBadge("Number read from the video; confirm") : "") + '<span class="tag light">' + esc(p.positionDetail || POS[p.position] || p.position) + "</span></div>" +
        '<div class="name">' + esc(fullName(p)) + "</div>" + (p.commitment ? '<div><span class="tag red">Committed: ' + esc(p.commitment.split(",")[0]) + "</span></div>" : "") +
        '<div class="meta">' + esc([p.hometown, p.birthYear ? "Born " + p.birthYear : "", p.gradYear ? "Grad " + p.gradYear : ""].filter(Boolean).join(" · ") || "Hometown · Grad year") + "</div></div></a>";
    }).join("");
    return pageHead(D.team.season + " season", "Roster", "") +
      '<section class="section"><div class="wrap">' +
      (anyPh && preview() ? '<p class="note-box" style="margin-bottom:1.5rem">These are placeholder cards. The real roster goes in <code>data/players.json</code> once each player\'s consent form is back. The goalie, defence and forward split shown is a sample.</p>' : "") +
      '<div class="filters" role="group" aria-label="Filter by position">' + chips + "</div>" +
      '<div class="roster-grid">' + cards + "</div></div></section>";
  }

  function factRow(label, value, check) {
    if (!value && !preview()) return "";
    return "<div><dt>" + esc(label) + "</dt><dd>" + (value ? esc(value) + (check ? checkBadge(check) : "") : '<span class="empty-line">To come</span>') + "</dd></div>";
  }

  function playerGallery(p) {
    var g = p.gallery || [];
    if (!g.length) return "";
    return '<div class="pgal" aria-label="Photos of ' + esc(fullName(p)) + '">' + g.map(function (src, i) {
      return '<img src="' + esc(src) + '" alt="' + esc(fullName(p)) + ', photo ' + (i + 1) + '" loading="lazy">';
    }).join("") + '</div><span class="muted pgal-hint">Swipe for more photos &rarr;</span>';
  }

  function pagePlayer(p) {
    var shootLabel = p.position === "G" ? "Catches" : "Shoots";
    return '<section class="section"><div class="wrap">' +
      '<a class="back" href="#roster">&larr; Back to roster</a>' +
      '<div class="profile">' + (p.introVideo
        ? '<div class="stack"><div class="intro-video"><video controls playsinline preload="metadata" poster="' + esc(p.introPoster || p.photo) + '" src="' + esc(p.introVideo) + '" aria-label="Intro video: ' + esc(fullName(p)) + '"></video></div><span class="eyebrow">Meet ' + esc(p.firstName) + ": intro video</span>" + playerGallery(p) + "</div>"
        : photoBox(p.photo, fullName(p), "photo", p.photo ? "" : num(p))) +
      '<div class="stack-lg"><div class="stack"><div class="big-num">' + esc(num(p)) + (p.numberCheck ? checkBadge("Number read from the video; confirm") : "") + "</div><h1>" + esc(fullName(p)) + "</h1>" +
      '<div class="btn-row"><span class="tag red">' + esc(p.positionDetail || POS[p.position] || p.position) + "</span>" + (p.placeholder && preview() ? '<span class="check">PLACEHOLDER</span>' : "") + "</div></div>" +
      '<dl class="facts">' + factRow(shootLabel, p.shoots === "L" ? "Left" : p.shoots === "R" ? "Right" : p.shoots) + factRow("Hometown", p.hometown) + factRow("Birth year", p.birthYear) + factRow("Grad year", p.gradYear) + (p.uniStart ? factRow("University start", p.uniStart) : "") +
      factRow("Height", p.height) + factRow("School", p.currentSchool) + (p.school || !p.currentSchool ? factRow("University", p.school, p.schoolCheck) : "") + (p.commitment ? factRow("Committed to", p.commitment) : factRow("Target level", p.targetLevel)) + (p.study ? factRow("Wants to study", p.study) : "") + "</dl>" +
      '<div class="stack"><h3>About</h3>' + (p.bio ? "<p>" + esc(p.bio) + "</p>" : "") + (p.loves ? '<blockquote class="player-quote"><span class="eyebrow">What I love most about hockey</span><p>' + esc(p.loves) + "</p></blockquote>" : "") + (p.interests ? "<p><strong>Outside of hockey:</strong> " + esc(p.interests) + "</p>" : "") + (!p.bio && !p.loves && !p.interests ? (preview() ? '<p class="empty-line">A short bio in her own words goes here.</p>' : '<p class="muted">Her profile is coming soon.</p>') : "") + "</div>" +
      '<div class="stack"><h3>Hockey history</h3>' + (p.history && p.history.length ? '<ul class="history">' + p.history.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : !preview() ? '<p class="muted">Coming soon.</p>' : '<p class="empty-line">Past teams, captaincies and awards go here.</p>') + "</div>" +
      (p.academics ? '<div class="stack"><h3>Academics</h3><p>' + esc(p.academics) + "</p></div>" : "") +
      (p.influences && p.influences.length ? '<div class="stack"><h3>Who inspired her game</h3><ul class="history">' + p.influences.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" + (p.influenceNote ? '<blockquote class="player-quote">' + esc(p.influenceNote) + "</blockquote>" : "") + "</div>" : "") +
      (p.dreamCity ? '<div class="stack"><h3>Dream PWHL city</h3><p>' + esc(p.dreamCity) + "</p></div>" : "") +
      '<div class="btn-row">' + (p.video ? '<a class="btn outline" href="' + esc(p.video) + '" target="_blank" rel="noopener">Watch highlights</a>' : "") +
      '<a class="btn" href="#recruiting" data-about="' + esc(fullName(p) + " " + num(p)) + '">Contact staff about this player</a></div>' +
      '<p class="muted" style="font-size:.875rem">We never post players\' personal phone numbers, addresses or birth dates.</p>' +
      "</div></div></div></section>";
  }

  function pageCoaches() {
    var cards = D.coaches.filter(function (c) { return !c.noPhoto && (!c.nameCheck || preview()); }).map(function (c) {
      return '<a class="card" href="#' + esc(c.id) + '">' + photoBox(c.photo, c.name, "photo") +
        '<div class="info"><span class="eyebrow">' + esc(c.role) + '</span><div class="name">' + esc(c.name) + (c.nameCheck ? checkBadge(c.nameCheck) : "") + "</div>" +
        '<div class="meta">' + esc(c.tagline || c.hometown || "Bio coming") + "</div></div></a>";
    }).join("");
    var staff = D.coaches.filter(function (c) { return c.noPhoto; }).map(function (c) {
      return '<a class="staff-line" href="#' + esc(c.id) + '"><span class="eyebrow">' + esc(c.role) + '</span><span class="name">' + esc(c.name) + "</span></a>";
    }).join("");
    return pageHead("Staff", "Coaches", "") +
      '<section class="section"><div class="wrap stack-lg"><div class="roster-grid">' + cards + "</div>" +
      (staff ? '<div class="staff-row">' + staff + "</div>" : "") + "</div></section>";
  }

  function pageCoach(c) {
    return '<section class="section"><div class="wrap"><a class="back" href="#coaches">&larr; Back to coaches</a>' +
      '<div class="profile' + (c.noPhoto ? " no-photo" : "") + '">' + (c.noPhoto ? "" : photoBox(c.photo, c.name, "photo")) +
      '<div class="stack-lg"><div class="stack"><span class="eyebrow">' + esc(c.role) + "</span><h1>" + esc(c.name) + "</h1>" +
      ([c.hometown, c.tagline].filter(Boolean).length ? '<p class="muted">' + esc([c.hometown, c.tagline].filter(Boolean).join(" · ")) + "</p>" : "") + "</div>" +
      '<div class="stack"><h3>Athletic background</h3>' + (c.playingHistory.length ? '<ul class="history">' + c.playingHistory.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : '<p class="' + (preview() ? 'empty-line">To come.' : 'muted">Coming soon.') + '</p>') + "</div>" +
      '<div class="stack"><h3>Coaching philosophy</h3>' + (c.bio ? "<p>" + esc(c.bio) + "</p>" : (preview() ? '<p class="empty-line">A short bio and coaching philosophy, 2 to 3 sentences, goes here.</p>' : '<p class="muted">Coming soon.</p>')) + "</div>" +
      (c.sources.length ? '<p class="muted" style="font-size:.875rem">Sources: ' + c.sources.map(function (s, i) { return ext(s, "link " + (i + 1)); }).join(", ") + "</p>" : "") +
      "</div></div></div></section>";
  }

  function pageAlumni() {
    var A = D.alumni, ci = A.campInvites;
    var list = A.alumni.filter(visible);
    var stats = A.groups.map(function (g) {
      var n = list.filter(function (a) { return a.group === g.id; }).length;
      return '<div class="stat"><b>' + n + "</b><span>" + esc(g.label) + "</span></div>";
    }).join("") + '<div class="stat"><b>' + ci.players.filter(visible).length + "</b><span>PWHL camp invites 2026-27</span></div>";

    var invites = ci.players.filter(visible).map(function (p) {
      return '<div class="invite"><span class="eyebrow">Invited to camp</span><div class="camp">' + (p.logo ? '<img class="camp-logo" src="' + esc(p.logo) + '" alt="' + esc(p.camp) + ' logo">' : "") + esc(p.camp) + (p.check ? checkBadge(p.checkNote) : "") + "</div>" +
        '<div class="who">' + esc(p.name) + ' <span class="muted">· ' + esc(p.hometown) + "</span></div><p class=\"muted\">" + esc(p.path) + "</p>" +
        (p.check && preview() ? '<p class="check-note">' + esc(p.checkNote) + "</p>" : "") + "</div>";
    }).join("");

    var groups = A.groups.map(function (g) {
      var rows = list.filter(function (a) { return a.group === g.id; }).map(function (a) {
        var tags = (a.tags || []).map(function (t) { return '<span class="tag' + (/PWHL|Olympian|Team Canada/.test(t) ? " red" : "") + '">' + esc(t) + "</span>"; }).join("");
        return '<div class="alum"><div><div class="nm">' + esc(a.name) + (a.check ? checkBadge(a.checkNote) : "") + '</div><div class="ht">' + esc(a.hometown) + "</div>" +
          (tags ? '<div class="tags">' + tags + "</div>" : "") + "</div>" +
          '<div class="wc"><b>With the Wildcats</b>' + esc(a.wildcats) + "</div>" +
          "<div><p>" + esc(a.path) + '</p><div class="src">' + ext(a.source, "Source") + "</div>" +
          (a.check && preview() ? '<p class="check-note">' + esc(a.checkNote) + "</p>" : "") + "</div></div>";
      }).join("");
      return '<div class="stack"><div class="section-title" style="margin-bottom:0;border:0"><h2>' + esc(g.label) + "</h2></div>" +
        '<div class="alumni-list">' + rows + "</div></div>";
    }).join("");

    return '<section class="page-head"><div class="wrap"><span class="eyebrow">Alumni</span><h1>From the Wildcats to the next level</h1>' +
      "<p>Our alumni have gone on to NCAA Division I, NCAA Division III, U Sports, Team Canada and pro hockey in Europe and the PWHL.</p>" +
      '<div class="stats" style="margin-top:1rem">' + stats + "</div>" +
      '<p style="margin-top:1.25rem;padding:.75rem 1rem;border-left:4px solid var(--red, #A52C33);background:rgba(255,255,255,.06);color:#fff;max-width:46rem">Every effort was made to include everyone. If you have been missed or there is an inaccuracy, please ' +
      (D.team.contactEmail ? '<a style="color:#fff;font-weight:700" href="mailto:' + esc(D.team.contactEmail) + '?subject=Wildcats%20alumni%20page">email us</a>' : '<a style="color:#fff;font-weight:700" href="#recruiting">email us</a>' + checkBadge("Links to the contact page until the team email is added")) + "!</p>" +
      "</div></section>" +
      '<section class="section alt"><div class="wrap"><div class="section-title"><h2>' + esc(ci.title) + "</h2></div>" +
      '<p style="margin-bottom:1.25rem">' + esc(ci.intro) + " Source: " + ext(ci.source, ci.sourceLabel) + ".</p>" +
      '<div class="invite-list">' + invites + "</div></div></section>" +
      '<section class="section"><div class="wrap stack-lg">' + groups +
      '<p class="note-box">Counts include only alumni listed on this page, each with a public source. Older sources that say "PWHL" mean the Provincial Women\'s Hockey League, the earlier name for today\'s OWHL U22 Elite level, not the professional PWHL that began in 2024.</p>' +
      "</div></section>";
  }

  function pageSchedule() {
    var now = new Date(), t = D.team;
    function gameRow(g) {
      var d = parseDate(g.date), past = d < now;
      return '<div class="game' + (past ? " past" : "") + '"><div class="when">' + DOW[d.getDay()] + " " + MON[d.getMonth()] + " " + d.getDate() + "<small>" + time12(d) + "</small></div>" +
        '<div><div class="vs">' + (g.home ? "vs " : "at ") + esc(g.opponent) + '</div><div class="where">' + esc(g.rink) + "</div></div>" +
        '<span class="tag' + (g.home ? " red" : "") + '">' + (past ? "Final" : g.home ? "Home" : "Away") + "</span></div>";
    }
    var sorted = D.games.slice().sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    var upcoming = sorted.filter(function (g) { return parseDate(g.date) >= now; });
    var earlier = sorted.filter(function (g) { return parseDate(g.date) < now; });
    var rows = (upcoming.length ? upcoming.map(gameRow).join("") : '<p class="muted">No more games on the list this season.</p>') +
      (earlier.length ? '</div><details class="earlier-games"><summary>Earlier this season (' + earlier.length + " games)</summary><div class=\"games\">" + earlier.reverse().map(gameRow).join("") + "</div></details><div>" : "");
    var tour = t.tournament && visible(t.tournament)
      ? '<div class="panel dark"><span class="eyebrow">Tournament</span><h3>' + esc(t.tournament.name) + checkBadge(t.tournament.note) + '</h3><p class="muted">' + esc(t.tournament.dates) + ". " + esc(t.tournament.note) + "</p></div>"
      : "";
    return pageHead(t.season, "Schedule & results", "") +
      '<section class="section"><div class="wrap two-col"><div class="stack">' +
      '<div class="btn-row"><a class="btn" href="' + esc(t.links.officialSchedule) + '" target="_blank" rel="noopener">Full schedule and scores</a>' +
      '<a class="btn outline" href="' + esc(t.links.youtube) + '" target="_blank" rel="noopener">Watch live on YouTube</a></div>' +
      '<div class="panel"><span class="eyebrow">Home ice</span><h3>' + esc(t.homeRink) + (t.homeRinkCheck ? checkBadge("Confirm the arena's full name") : "") + "</h3>" +
      (t.homeRinkAddress ? '<p>' + esc(t.homeRinkAddress) + '</p><div class="map-embed"><iframe src="https://www.google.com/maps?q=' + encodeURIComponent("Forest Glade Arena, " + t.homeRinkAddress) + '&output=embed" title="Map to ' + esc(t.homeRink) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
        '<div class="btn-row"><a class="btn outline" href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent("Forest Glade Arena, " + t.homeRinkAddress) + '" target="_blank" rel="noopener">Get directions</a></div>' : "") +
      "</div>" + tour + "</div>" +
      '<div class="stack"><div class="section-title" style="margin-bottom:0;border:0"><h2>Coming up</h2></div><div class="games">' + rows + "</div>" +
      '<p class="muted" style="font-size:.875rem">Game list copied from the official schedule. Times are local (Eastern).</p></div></div></section>';
  }

  function formMsg(kind) {
    var url = kind === "recruit" ? D.team.recruitFormUrl : D.team.sponsorFormUrl;
    return url ? "" : '<div class="form-msg" id="' + kind + '-msg" hidden></div>';
  }
  function formOrLink(kind, fieldsHtml) {
    var url = kind === "recruit" ? D.team.recruitFormUrl : D.team.sponsorFormUrl;
    if (url) return '<div class="panel"><p>Fill in our short form and a staff member will reply.</p><div class="btn-row"><a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Open the form</a></div></div>';
    return '<form class="form" id="' + kind + '-form" novalidate>' + fieldsHtml + formMsg(kind) +
      '<div class="full"><button class="btn" type="submit">Send</button></div></form>' +
      (D.team.contactEmail ? '<p class="muted" style="margin-top:1rem">Prefer to email? Write to <a href="mailto:' + esc(D.team.contactEmail) + '">' + esc(D.team.contactEmail) + "</a>.</p>" : "");
  }
  function field(id, label, type, extra, full) {
    var input = type === "textarea" ? '<textarea id="' + id + '" name="' + id + '" rows="5">' + (extra || "") + "</textarea>"
      : type === "select" ? '<select id="' + id + '" name="' + id + '">' + extra + "</select>"
      : '<input id="' + id + '" name="' + id + '" type="' + type + '">';
    return '<div class="field' + (full ? " full" : "") + '"><label for="' + id + '">' + esc(label) + "</label>" + input + "</div>";
  }

  function headCoachName() {
    var hc = D.coaches.find(function (c) { return /head coach/i.test(c.role); });
    return hc ? hc.name : "our head coach";
  }

  function pageRecruiting() {
    var opts = ["Player", "Parent", "Scout or college coach", "Sponsor", "Other"].map(function (o) { return "<option>" + o + "</option>"; }).join("");
    var fields = field("r-name", "Your name", "text") + field("r-role", "I am a", "select", opts) +
      field("r-email", "Email", "email") + field("r-team", "Current team", "text") +
      field("r-born", "Birth year (players)", "text") + field("r-pos", "Position (players)", "text") +
      field("r-reel", "Highlight reel link (players)", "url") +
      field("r-msg", "Message", "textarea", ui.aboutPlayer ? esc("About " + ui.aboutPlayer + ": ") : "", true);
    return pageHead("Recruiting & contact", "Play for the Wildcats",
      "We are looking for driven players who want to compete in the OWHL U22 Elite division and take the next step to university or pro hockey.") +
      '<section class="section"><div class="wrap two-col"><div class="stack">' +
      "<h2>Players and parents</h2><p>Tell us about yourself and a coach will be in touch about skates, tryouts and what the season looks like.</p>" +
      "<h2>Send your highlight reel</h2><p>Want Head Coach " + esc(headCoachName()) + " to see you play? Upload your highlight reel to YouTube (set to Unlisted), Hudl or Google Drive (set to \u201cAnyone with the link\u201d), then paste the link in the form. Include your jersey number and the colour you are wearing.</p>" +
      "<h2>University and College Scouts</h2><p>Use the form to request player profiles, video or game times.</p>" +
      '<p class="muted">Home games also stream live on ' + ext(D.team.links.youtube, "our YouTube channel") + ".</p></div>" +
      formOrLink("recruit", fields) + "</div></section>";
  }

  function pageSponsors() {
    var list = D.sponsors.filter(visible);
    var tiles = list.map(logoTile).join("");
    var fields = field("s-biz", "Business name", "text") + field("s-name", "Contact name", "text") +
      field("s-email", "Email", "email") + field("s-phone", "Phone", "tel") + field("s-msg", "Message", "textarea", "", true);
    return pageHead("Sponsors", "Thank you to our sponsors",
      "Local businesses help keep elite girls' hockey going in Windsor-Essex." + checkBadge("Confirm what sponsor money pays for, and the package levels")) +
      '<section class="section"><div class="wrap stack-lg"><div class="logo-grid">' + tiles + "</div>" +
      '<div class="two-col"><div class="stack"><h2>Become a sponsor</h2><p>Sponsor packages are being finalized. Send us a note and the team manager will follow up.</p></div>' +
      formOrLink("sponsor", fields) + "</div></div></section>";
  }

  function pageGallery() {
    var pics = D.team.gallery || [];
    var order = D.team.galleryAlbums || [];
    pics.forEach(function (g) { if (g.album && order.indexOf(g.album) < 0) order.push(g.album); });
    var albums = order.filter(function (a) { return pics.some(function (g) { return g.album === a; }); });
    if (!ui.album || albums.indexOf(ui.album) < 0) ui.album = albums[0] || "";
    var chips = albums.length > 1 ? '<div class="filters">' + albums.map(function (a) {
      return '<button class="chip" data-album="' + esc(a) + '" aria-pressed="' + (ui.album === a) + '">' + esc(a) + "</button>";
    }).join("") + "</div>" : "";
    var shown = pics.filter(function (g) { return !albums.length || g.album === ui.album; });
    var tiles = shown.map(function (g) { if (g.video) return '<video class="wide' + (g.tall ? " tall" : "") + '" aria-label="' + esc(g.alt || "") + '" src="' + esc(g.video) + '"' + (g.poster ? ' poster="' + esc(g.poster) + '"' : "") + ' controls playsinline preload="metadata"></video>'; var im = '<img' + (g.wide && !g.label ? ' class="wide"' : "") + ' src="' + esc(g.image) + '" alt="' + esc(g.alt || "") + '" loading="lazy">'; return g.label ? '<figure class="labeled' + (g.wide ? " wide" : "") + '">' + im + "<figcaption>" + esc(g.label) + "</figcaption></figure>" : im; }).join("");
    return pageHead("Gallery", "Photos", "") +
      '<section class="section"><div class="wrap stack-lg">' + chips +
      (ui.album ? '<h2 style="margin:0">' + esc(ui.album) + "</h2>" : "") +
      '<div class="gallery-grid">' + tiles + "</div>" + credit() +
      '<div class="btn-row"><a class="btn" href="' + esc(D.team.links.instagram) + '" target="_blank" rel="noopener">More on Instagram</a>' +
      '<a class="btn outline" href="' + esc(D.team.links.youtube) + '" target="_blank" rel="noopener">Game video on YouTube</a></div></div></section>';
  }

  /* ---------- router ---------- */
  function route() {
    var h = (location.hash || "").replace(/^#/, "") || "home";
    var main = document.getElementById("main");
    var navKey = h, html;
    var player = D.players.find(function (p) { return p.id === h; });
    var coach = D.coaches.find(function (c) { return c.id === h; });
    if (player) { html = pagePlayer(player); navKey = "roster"; }
    else if (coach) { html = pageCoach(coach); navKey = "coaches"; }
    else {
      html = ({
        home: pageHome, roster: pageRoster, coaches: pageCoaches, alumni: pageAlumni,
        schedule: pageSchedule, sponsors: pageSponsors, recruiting: pageRecruiting, gallery: pageGallery
      }[h] || pageHome)();
      if (!/^(home|roster|coaches|alumni|schedule|sponsors|recruiting|gallery)$/.test(h)) navKey = "home";
    }
    main.innerHTML = html;
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === navKey) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.title = (navKey === "home" ? "" : (NAV.find(function (n) { return n[0] === navKey; }) || ["", ""])[1] + " | ") + D.team.teamName + " " + D.team.division;
    window.scrollTo(0, 0);
    if (h !== "recruiting") ui.aboutPlayer = "";
  }

  function wire() {
    document.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      if (chip) { ui.rosterFilter = chip.getAttribute("data-filter"); route(); return; }
      var alb = e.target.closest("[data-album]");
      if (alb) { ui.album = alb.getAttribute("data-album"); route(); return; }
      var about = e.target.closest("[data-about]");
      if (about) ui.aboutPlayer = about.getAttribute("data-about");
    });
    document.addEventListener("submit", function (e) {
      var f = e.target;
      if (!f.id || !/-form$/.test(f.id)) return;
      e.preventDefault();
      var msg = document.getElementById(f.id.replace("-form", "-msg"));
      var to = D.team.contactEmail;
      if (to) {
        var lines = Array.prototype.map.call(f.querySelectorAll("input, select, textarea"), function (el) {
          var lab = f.querySelector('label[for="' + el.id + '"]');
          return (lab ? lab.textContent : el.name) + ": " + (el.value || "");
        });
        var subj = f.id === "sponsor-form" ? "Sponsorship enquiry" : "Player / scout enquiry";
        window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Wildcats website: " + subj) + "&body=" + encodeURIComponent(lines.join("\n"));
        if (msg) { msg.hidden = false; msg.textContent = "Your email app should open with your message ready to send. If it doesn't, email " + to + "."; }
      } else if (msg) {
        msg.hidden = false;
        msg.textContent = "This is a mock-up, so nothing was sent.";
      }
    });
    window.addEventListener("hashchange", route);
  }

  function fail(err) {
    document.getElementById("app").innerHTML = '<div class="load-error"><h2>The site could not load its information</h2><p>' + esc(err) +
      "</p><p>This usually means a typo in one of the files in the data folder, such as a missing comma or quote mark. Undo your last change, or paste the file into jsonlint.com to find the line.</p></div>";
  }

  function start(data) {
    D = data;
    try { shell(); wire(); route(); } catch (e) { fail(e.message); }
  }

  if (window.WILDCATS_DATA) { start(window.WILDCATS_DATA); return; }
  Promise.all(DATA_FILES.map(function (name) {
    return fetch("data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Missing file: data/" + name + ".json");
      return r.json().catch(function () { throw new Error("Typo in data/" + name + ".json"); });
    });
  })).then(function (arr) {
    var d = {};
    DATA_FILES.forEach(function (n, i) { d[n] = arr[i]; });
    start(d);
  }).catch(function (e) { fail(e.message); });
})();
