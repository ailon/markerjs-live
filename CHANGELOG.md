# marker.js Live Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2021-10-13
- ### Changed
- deprecated CSSStyleSheet `rules` and `addRule()` members replaced with standard `cssRules` and `insertRule`

## [1.0.1] - 2021-10-08
### Changed
- `target` can now be any HTMLElement (not just image)

## [1.0.0] - 2021-09-20
### Changed
- promote beta.1 to 1.0 release.

## [1.0.0-beta.1] - 2021-08-26
### Added
- removeEventListener method

### Fixed
- CurveMarker wasn't scaled properly

## [1.0.0-beta.0] - 2021-08-13
### Added
- basic information and documentation in README.
- reference documentation.

### Removed
- excess code.

## [1.0.0-alpha.4] - 2021-08-10
### Added
- `pointerenter` and `pointerleave` events

### Fixed
- `PointerEventHandler` type wasn't exported

## [1.0.0-alpha.3] - 2021-08-06
### Added
- public MarkerBase.outerContainer property

## [1.0.0-alpha.2] - 2021-08-06
### Added
- CurveMarker support
- inner group (container) outer group container is untouched by transformations

## [1.0.0-alpha.1] - 2021-08-05
### Fixed
- missing exports

## [1.0.0-alpha.0] - 2021-08-05
### Added
- Initial public preview release.

[1.0.2]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.2
[1.0.1]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.1
[1.0.0]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0
[1.0.0-beta.1]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-beta.1
[1.0.0-beta.0]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-beta.0
[1.0.0-alpha.4]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-alpha.1
[1.0.0-alpha.0]: https://github.com/ailon/markerjs-live/releases/tag/v1.0.0-alpha.0