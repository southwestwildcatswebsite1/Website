# How to update the Southwest Wildcats website

This guide is for the team manager or parent who looks after the site. You do not need to know how to code. Almost every update means changing words in one small text file.

> **Consent status (2026-27):** Julia confirmed on November 12, 2026 that all 19 families gave consent for each player's information, photos and intro video to be used on the site. Keep the signed forms in the team Google Drive. Collect new forms each season, and for any new player.

## 1. How the site is put together

| Folder or file | What it holds | Do you edit it? |
|---|---|---|
| `data/players.json` | The roster: one block per player | Yes, every season |
| `data/coaches.json` | Coaches and manager | Yes, when staff change |
| `data/alumni.json` | PWHL camp invites and alumni by level | Yes, when there is news |
| `data/games.json` | Upcoming games | Optional (scores stay on the association site) |
| `data/sponsors.json` | Sponsor names, logos, websites | Yes, when sponsors change |
| `data/team.json` | Team name, season, links, team email, form links, preview switch | Once a season |
| `photos/` | All pictures (players, coaches, gallery, sponsor logos) | Yes, add pictures here |
| `index.html`, `assets/` | The design and the code | No. Leave these alone |

Every player page uses the same template, so adding a player is just adding a block of text. The page builds itself.

## 2. The one rule for data files

The data files use a format called JSON. It is fussy about punctuation:

- Words go inside straight double quotes: `"Essex, ON"`
- Each line inside a block ends with a comma, **except the last one**
- Blocks are separated by a comma: `},` then the next `{`

If the site shows "The site could not load its information", a comma or quote mark is missing. Undo your last change, or paste the file into **jsonlint.com**, which points to the exact line.

## 3. Add or change a player

Open `data/players.json`. Each player looks like this:

```json
{
  "id": "player-07",
  "placeholder": false,
  "firstName": "Jane",
  "lastName": "Sample",
  "number": "12",
  "position": "D",
  "positionDetail": "Defence",
  "shoots": "L",
  "hometown": "Essex, ON",
  "birthYear": "2005",
  "gradYear": "2027",
  "height": "5'7\"",
  "school": "St. Clair College",
  "targetLevel": "NCAA D1",
  "academics": "",
  "history": ["Sun Parlour U18AA, captain 2025-26"],
  "bio": "Two or three sentences in her own words.",
  "introVideo": "videos/jane-sample.mp4",
  "introPoster": "videos/jane-sample.jpg",
  "video": "https://www.youtube.com/watch?v=...",
  "photo": "photos/players/jane-sample.jpg"
}
```

- `position`: use `F`, `D` or `G` (this drives the Forwards / Defence / Goalies filter). `positionDetail` is what shows on the page: Centre, Left wing, Right wing, Defence or Goalie.
- The roster page sorts players by jersey number automatically.
- `id`: lowercase, no spaces. It becomes the page address, for example `#jane-sample`.
- Leave anything she has not agreed to share as `""` (empty). The page shows "To come" or hides it.
- `history` is a list: `["first item", "second item"]`.
- Set `"placeholder": false` once it is a real player.
- **Only add a player after her signed consent form is back** (and a parent's signature if she is under 18). Birth year is fine to post (scouts expect it), but never add full birth dates, home addresses, personal phone numbers or health information.

To remove a player who asks, delete her whole block (from `{` to `},`) the same week, and note the date on her consent form.

## 4. Photos

1. Name the file simply, with no spaces: `jane-sample.jpg`.
2. Shrink it first so pages load fast on phones. Aim for about 1200 pixels wide and under 400 KB. Free tools: squoosh.app or tinypng.com.
3. Put player photos in `photos/players/`, coach photos in `photos/coaches/`, sponsor logos in `photos/sponsors/`.
4. Type the path into the person's `"photo"` line, for example `"photos/players/jane-sample.jpg"`.

Portrait photos (taller than wide, about 4 by 5) fit the player cards best.

### Intro videos

Each player has a short intro video in the `videos/` folder. Before adding a new one, shrink it so it loads quickly on phones: about 720p and under 3 MB. The originals from the videographer are 17 to 43 MB each, which is too big. A free tool such as HandBrake (preset "Fast 720p30") does this. Put the file in `videos/`, name it after the player (`jane-sample.mp4`), and type the path into `"introVideo"`. Save one still frame as `jane-sample.jpg` for `"introPoster"`. That's the picture shown before the video plays.

### Home page video and YouTube links

The home page has a short silent video loop (`videos/team-reel.mp4`) that sends visitors to the YouTube channel when they tap it. To swap it, put a new short clip (10 to 20 seconds, 720p, under 4 MB) in `videos/` and change `"reel"` in `data/team.json`.

To feature particular games or highlights, add them to `"featuredVideos"` in `data/team.json`:

```json
"featuredVideos": [
  { "title": "Highlights vs Ottawa, Nov 14", "url": "https://www.youtube.com/watch?v=..." }
]
```

They show as links next to the video loop.

### Latest Instagram post

The home page shows one Instagram post that opens on Instagram when tapped. To change it (about 2 minutes):
1. On Instagram, open the post, tap the three dots, then "Copy link".
2. Save the post's picture (or a screenshot of it) into `photos/` as `instagram-latest.jpg`.
3. In `data/team.json`, fill in `"instagramLatest"`: the link as `"url"`, `"photos/instagram-latest.jpg"` as `"image"`, and a one-line `"caption"`.

### Recent game photo

The home page has a "Game highlights" box with one photo from a recent game. To change it:
1. Save the photo into `photos/` (for example `photos/game-nov-14.jpg`), shrunk to about 1200 pixels wide. Landscape photos fit best.
2. In `data/team.json`, fill in `"recentGame"`: `"image"` (the photo path), `"title"` (for example "Wildcats 3, Whitby 2"), `"date"` ("Nov 14"), and a one-line `"caption"`.
3. Optional: put a YouTube link to the game in `"link"`, and the button words in `"linkLabel"`.

Only use photos where every player shown has a signed consent form. If `"image"` is left empty, the box is hidden on the live site.

## 5. Alumni and PWHL news

Open `data/alumni.json`. Copy an existing alumni block, change the words, and set `"group"` to `d1`, `d3` or `usports`. Always add a `"source"` link to a public page that shows she played for the Wildcats (a college roster or Elite Prospects). The counts at the top of the Alumni page update themselves.

House rules for alumni:
- Say "invited" to a PWHL camp, never "signed", unless the PWHL has announced a contract.
- In older articles, "PWHL" means the Provincial Women's Hockey League, the old name for our OWHL U22 Elite level. It is not the professional league.
- Add `"check": true` and a `"checkNote"` to anything not confirmed yet. Those items show a yellow CHECK badge in preview mode and stay hidden on the live site.

## 6. The preview switch

In `data/team.json`, `"previewMode": true` shows the yellow banner, the CHECK badges and the grey placeholder boxes. Set it to `false` before launch. Anything marked `"check": true` then disappears from the public site until someone confirms it and removes the check line.

## 7. Forms (recruiting and sponsors)

The site has no server of its own, so forms are handled by a free Google Form that belongs to the team Gmail account:

1. Signed in as the team Gmail, make a Google Form with the same questions as the mock-up form.
   For the recruiting form, include a short-answer question "Highlight reel link". Players paste a YouTube, Hudl or Google Drive link, which is easier for them and keeps big video files out of the team Drive. (Google Forms can take file uploads, but only from people signed in to a Google account.)
2. Click Send, then the link icon, and copy the link.
3. Paste it into `data/team.json` as `"recruitFormUrl"` (and `"sponsorFormUrl"` for sponsors).

The page then shows an "Open the form" button. Answers land in the team's Google Drive, so the next manager inherits them along with the email.

## 8. Where the site lives, and how to edit it

Recommended setup (all free, all owned by the team Gmail):

- **GitHub** (free account in the team's name) stores the site files. You can edit any data file in your web browser: open the file, click the pencil icon, change the text, click "Commit changes". The live site updates within a couple of minutes.
- **GitHub Pages** publishes the site for free and works with your own domain name.
- **Domain name** registered under the team Gmail (see costs below).

Optional, still to test: **Pages CMS** (pagescms.org) is a free editing screen that sits on top of GitHub and gives you form boxes instead of raw text. We will confirm it works with these data files before relying on it.

## 9. Handing over to the next parent

Because the team Gmail owns GitHub, the domain and the Google Forms, handover is a password change:

1. Meet the new manager and log in to the team Gmail together.
2. Change the Gmail password and recovery phone to theirs.
3. Log in to GitHub with the team Gmail and confirm the site files are there. Add the new manager's own GitHub account as a collaborator if they prefer their own login, and remove people who have left.
4. Log in to the domain registrar and note the renewal date in the team calendar.
5. Make one small edit together (for example, change the season in `team.json`) so they have done it once.

## 10. Costs (checked November 12, 2026)

| Item | Cost | Notes |
|---|---|---|
| Hosting (GitHub Pages) | $0 | Free for public sites. Limits: 1 GB site size, about 100 GB of visitors' downloads a month, far more than a team site uses. |
| Editing (GitHub website, optional Pages CMS) | $0 | Pages CMS says it is 100% free. |
| Forms (Google Forms) | $0 | Uses the team Gmail. |
| `.ca` domain | about $12 to $13 CAD a year | Example: CanSpace lists .ca at $11.99 CAD the first year and $12.99 CAD a year after. CIRA (the .ca registry) says .ca names typically cost $10 to $20 a year. |
| **Total** | **about $12 to $20 CAD a year** | Compare: Squarespace Core lists $29 a month billed annually (about $348 a year, probably US dollars). |

Sources: canspace.ca/domains.html, cira.ca ("How much does a .CA domain cost?"), docs.github.com (GitHub Pages limits), pagescms.org.

GitHub's rules say Pages should not be used mainly to run an online business or store. A team site with sponsor thank-you logos is fine; selling merchandise or taking payments on it is not.

## Latest game clip (home page)
In data/team.json, under "recentGame", set:
- "youtubeId": the code after youtu.be/ (for example -Sr1DTcrIls)
- "start" and "end": the clip times in seconds (3:22 is 202)
- "date", "caption": shown above and beside the clip
- "link": the full game link (add ?t=202 to start at the clip)
The embedded clip shows blank in the Claude preview but plays on the live site. Check it after launch.
