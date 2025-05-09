# SCURE - Script Creation Utilities for Ric Escape (Conversational adventures).

## 1.7.0
### Added
- Make possible to look room names.

## 1.6.0
### Added
- Make possible jump rooms

## 1.5.1
### Fixed
- Do not fail when synonyms for an item are missing

## 1.5.0
### Added
- saves data[lastItem] when used or looked

## 1.4.3
### Added
- timeover can have conditional descriptions

## 1.4.2
### Added
- improved number recognition

## 1.4.1
### Added
- esa, esta, ese; as stopwords

## 1.4.0
### Added
- When answering questions (and wrong answer), maintains context so you can answer again directly

## 1.3.0
### Added
- When handling answer through plugin, sends user answer to plugin

## 1.2.0
### Added
- Handle plugins in answer actions
- Allow variable answers (must be inside data)

## 1.1.0
### Fixed
- Walk from a room to another room that has same name

## 1.0.10
### Added
- Ability to specify synonyms for commands. Like "look - robot" is the same as "use - robot"
 
## 1.0.9
### Added
- "Sala" as synonym for "room" when looking general

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
