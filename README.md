# Leonida Legend — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vyan0089-afk/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vyan0089-afk/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 Grand Theft Auto VI trophies on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze) on the road to the platinum, *Vice Got a Price!*

## What it does

- **Tracker** — every trophy with its official name, description and grade, exactly as listed. Tick a trophy when you earn it; progress is saved in localStorage on your device. Export your progress as JSON and import it back on any device.
- **Filters** — by kind (story, strangers, activities, collectibles, combat, exploration, economy, 100% completion, misc, platinum), by grade, by text search, missable-only, and earned-only.
- **Spoiler setting** — hides story trophies (name, description and guide) until you have earned them, so the checklist never spoils the story.
- **Guides** — a real guide for every trophy, written in our own words, each citing its sources by name in the app (Exophase · PSNProfiles). Open any trophy's guide to read what to do, where, how, and when it can be missed.
- **Roadmap to platinum** — eight ordered stages: story chapters 1–4, the final mission, stranger strands and character finales, activities, collectibles with their counts, combat and heists, exploration and economy, then cleanup and the 100% completion gold.
- **Missables** — every missable trophy flagged in the list, in the roadmap and on its own tab, with the reason it can be missed. The one trophy other guides single out is *Positive Mental Attitude* (meditate at every spot, starting in Chapter 1) — there is no mission replay, so do flagged things the first time the chance appears.
- **No online play** — all 55 trophies are single-player and offline; the app says so honestly and has no online category.
- **Fully offline** — no network requests at all: no external fonts, no CDN, no links in the app. The sunset-and-palm artwork is original CSS/SVG drawn for this app.

## How to run

```sh
node serve.ts
# open http://localhost:8080
```

Or build the hand-in bundle:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Node 22, standard library only. Screenshots live in `screenshots/` (see `shots.json` for the views they show).

## Sources

Trophy names, descriptions and grades are the official 55-trophy list. Guide sources, cited by name in the app:

- Exophase — Grand Theft Auto VI Trophies (PS5): https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — Grand Theft Auto VI trophy list (psnprofiles.com; search for "Grand Theft Auto VI")

Guide text in this app is written in our own words; the sources above are cited for the trophy list and its counts, not copied.
