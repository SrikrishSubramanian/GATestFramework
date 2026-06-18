# Spacer — Content Fixtures

This directory contains AEM content fixtures used by the spacer test suite. The fixture XML
can be deployed to a local or non-production AEM author instance so that tests run against
a controlled, stable content state rather than the live style-guide page.

## Deploy path

```
/content/global-atlantic/test-fixtures/spacer
```

## Source

The fixture is derived from the canonical spacer style-guide page:

```
/content/global-atlantic/style-guide/components/spacer
```

Source file in `kkr-aem`:

```
ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/spacer/.content.xml
```

## What is in the fixture (beyond the style-guide baseline)

### 1. Explicit `size-medium` spacer (`spacer_one_explicit_medium`)

The style-guide default spacer (`spacer_one`) has no `cq:styleIds` attribute, which causes AEM
to render it with the medium size as a fallback. This fixture adds a second spacer with
`cq:styleIds="[size-medium]"` so tests can assert that both DOM paths produce identical computed
heights (32 px mobile / 48 px desktop).

Relevant nodes: `spacer_one` (no styleId) and `spacer_one_explicit_medium` (`size-medium`).

### 2. Spacers inside a dark section (`section_dark_spacers`)

The style-guide spacers all appear outside any section context. This fixture wraps one spacer of
every size inside a `background-granite` section to verify that:

- Spacer heights are unaffected by the parent section's background colour.
- No inherited colour, padding, or margin from the dark background leaks into the spacer
  computed dimensions.

Spacers included: `size-xxsmall`, `size-xsmall`, `size-small`, default (medium), `size-large`,
`size-xlarge`.

### 3. Adjacent spacers (`spacer_adjacent_first` + `spacer_adjacent_second`)

Two spacers (`size-xsmall` then `size-large`) placed immediately adjacent with no intervening
content node. This tests that the spacer elements use `padding` or `min-height` (not `margin`)
for their sizing, so browser margin-collapsing cannot silently reduce the combined visual gap.
The sum of the two spacers' heights must equal the total measured distance between the
surrounding content blocks.

## Deploying the fixture

Use `curl` or the AEM Package Manager to POST the XML to the Granite content API, or copy the
file into your local `ui.content.ga` overlay at:

```
ui.content.ga/src/main/content/jcr_root/content/global-atlantic/test-fixtures/spacer/.content.xml
```

then run:

```bash
mvn clean install -PautoInstallSinglePackage -pl ui.content.ga
```

## Maintenance

When the canonical style-guide spacer page is updated (new size variant, renamed styleId, etc.),
mirror the change in `spacer-fixtures.xml` and update this README accordingly.
