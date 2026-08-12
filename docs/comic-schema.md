# Comic Metadata Schema (Phase 1)

This document defines the initial JSON contract for the comic system.

## episodes/episodes.json

Top-level index used for:
- archive listings
- episode order
- first/previous/next/latest navigation

Required fields per episode entry:
- id: string (folder name)
- episodeNumber: integer
- title: string
- slug: string
- publishDate: YYYY-MM-DD
- description: string
- thumbnail: path to web image
- episodePath: path to episode.json
- status: draft or published

## episodes/{episode-id}/episode.json

Required fields:
- id
- episodeNumber
- title
- slug
- publishDate
- description
- panels (ordered array)

Optional fields:
- coverPanel
- merchandiseUrl
- videoUrl

Panel object fields:
- file: panel image filename
- layout: standard | wide | full-width | two-column
- alt: accessible description
- caption: optional display caption

## Layout Semantics

- standard: default card width, supports two-up on wide viewports
- wide: spans full content width in reader grid
- full-width: edge-to-edge panel emphasis section
- two-column: explicit two-column grouping panel style

Mobile behavior is handled by reader CSS/template logic, not by separate data files.