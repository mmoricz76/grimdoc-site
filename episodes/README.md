# Episodes Content Model

This folder is the content source for the Life with Death comic reader.

Guiding rule: template first, episodes as content.

## Structure

Each episode has its own folder:

episodes/
  episodes.json
  001-dead-tired/
    episode.json
    panel-01.webp
    panel-02.webp

## Files

- episodes.json
  Maintains reading order and archive metadata used across the site.
- episode.json
  Stores episode-specific metadata and ordered panel definitions.

## Publish Flow

1. Export optimized panel images from private production repo.
2. Add panel files to the new episode folder in this repository.
3. Add or update episode.json for that episode.
4. Update episodes.json with the new episode entry.
5. Deploy. The comic template should render the episode from metadata.

## Do Not Store Here

- High-resolution source artwork
- Production draft files
- Proprietary references

Those belong in the private creator-vault repository.