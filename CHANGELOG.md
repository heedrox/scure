# SCURE - Script Creation Utilities for Ric Escape (Conversational adventures).

## 1.0.8
### Fixed
- Show "walk-nowhere" sentence when you can go nowhere.

## 1.0.7
### Added
- aPickingCondition, to allow setting conditions for picking objects.
- handle pluginExtensions in item descriptions (when looking)

### Fixed
- Getting items also in inventory

## 1.0.6
### Fixed
- Do not show destinations when looking at room and no possible destinations

### Added
- Say pickingResponse when item not pickable

## 1.0.5
### Added
- Respond something else if lock destination has a sentence when locked
- require('lib').stateLock 

### Removed
- scure-commons.isUnlocked

## 1.0.4
First general available public release