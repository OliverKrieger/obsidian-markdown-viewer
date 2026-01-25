# Statblock Authoring Guide (Obsidian)

This document explains how to write statblocks in Markdown so they render correctly
in the markdown viewer.

Statblocks are written using **callouts** and are **ruleset-driven**.
Each statblock declares a ruleset and follows that schema.

---

## General Structure

```md
> [!statblock] Creature Name
>
> ruleset: dnd5e | swade
> key: value
> key: value
>
> section:
> - entry
> - entry
```

### Authoring Rules
- `ruleset:` is **required**
- Order of fields does **not** matter
- Empty lines are allowed
- Sections must end with `:`
- Bullet entries must start with `-`
- `[[Links]]` automatically become hoverable references

---

## 🐉 D&D 5e Statblocks

### Minimal Example

```md
> [!statblock] Goblin
>
> ruleset: dnd5e
> size: Small
> creatureType: humanoid (goblinoid)
> alignment: neutral evil
> ac: 15 (leather armor)
> hp: 7 (2d6)
> speed: 30 ft.
> abilities: STR 8 (-1), DEX 14 (+2), CON 10 (+0), INT 10 (+0), WIS 8 (-1), CHA 8 (-1)
> skills: Stealth +6
> senses: darkvision 60 ft., passive Perception 9
> languages: Common, Goblin
> cr: 1/4 (+2)
>
> actions:
> - Scimitar: Melee Weapon Attack +4 to hit, 1d6+2 slashing damage.
```

---

### Supported Top-Level Fields (5e)

| Key                   | Example                      |
| --------------------- | ---------------------------- |
| `size`                | Large                        |
| `creatureType`        | dragon                       |
| `alignment`           | chaotic evil                 |
| `ac`                  | 22 (natural armor)           |
| `hp`                  | 546 (28d20 + 252)            |
| `speed`               | 40 ft., fly 80 ft.           |
| `abilities`           | STR 30 (+10), DEX 10 (+0), … |
| `saves`               | Dex +7, Con +16              |
| `skills`              | Perception +16               |
| `resistances`         | cold                         |
| `immunities`          | fire                         |
| `vulnerabilities`     | radiant                      |
| `conditionImmunities` | frightened                   |
| `senses`              | blindsight 60 ft.            |
| `languages`           | Common, Draconic             |
| `cr`                  | 24 (62,000 XP) (+7)          |
| `desc`                | Optional narrative paragraph |

---

### Section Blocks (5e)

Sections may include an optional description.

```md
> traits:
> desc: Passive or always-on abilities.
> - Legendary Resistance (3/Day): [[Legendary Resistance]]
```

#### Supported Sections:

```md
traits:
actions:
bonusActions:
reactions:
legendaryActions:
spells:
feats:
special:
```

Each section:
- Supports desc:
- Supports links
- Supports free-text descriptions

---

### Full Example:

```md
> [!statblock] Tharos, the Many-Turned Tyrant
> 
> ruleset: dnd5e
> size: Huge
> creatureType: fiend (devil), shapechanger
> alignment: lawful evil
> desc: A late-campaign boss designed for **large parties** and **high-level play**. Tharos swaps “stances” mid-fight, with extra action economy and modular sections. Use this to stress-test long sections, hover previews, and wide-screen wrapping.
>
> ac: 21 (infernal plate, cloak of emberglass)
> hp: 472 (32d12 + 256)
> speed: 40 ft., fly 60 ft. (hover)
> abilities: STR 24 (+7), DEX 16 (+3), CON 26 (+8), INT 18 (+4), WIS 18 (+4), CHA 22 (+6)
> saves: Str +13, Dex +9, Con +14, Wis +10, Cha +12
> skills: Arcana +10, Deception +12, Insight +10, Intimidation +12, Perception +10
> resistances: cold; bludgeoning, piercing, and slashing from nonmagical attacks
> immunities: fire, poison
> conditionImmunities: charmed, frightened, poisoned
> senses: truesight 120 ft., darkvision 120 ft., passive Perception 20
> languages: Common, Infernal, telepathy 120 ft.
> cr: 22 (41,000 XP) (+7)
>
> traits:
> desc: Passive rules and “always-on” effects. Mix of normal text, name-only entries, and wiki links to test hover previews.
> Infernal Anchor: Tharos cannot be banished while within 60 ft. of a lit brazier or a creature wearing a cursed brand.
> [[Magic Resistance]]
> Siege Monster: Tharos deals double damage to objects and structures.
> Legendary Resistance (4/Day): If Tharos fails a saving throw, he can choose to succeed instead.
> Aura of Ash: Creatures that start their turn within 10 ft. take 10 (3d6) fire damage and have disadvantage on the first attack they make before the end of that turn.
> Immutable Form: Tharos is immune to any spell or effect that would alter his form.
>
> actions:
> desc: Standard action suite. This block is intentionally **long** and includes several “paragraph-ish” entries.
> Multiattack: Tharos makes three attacks: one with his Infernal Glaive and two with his Claw, or two with his Infernal Glaive and one with Hellfire Bolt.
> Infernal Glaive: Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) slashing damage plus 14 (4d6) fire damage.
> Claw: Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage, and the target is grappled (escape DC 18).
> Hellfire Bolt: Ranged Spell Attack: +12 to hit, range 120 ft., one target. Hit: 21 (6d6) fire damage and 7 (2d6) necrotic damage.
> Command the Brand: Each creature of Tharos’s choice within 60 ft. wearing a cursed brand must succeed on a DC 20 Wisdom saving throw or immediately use its reaction to move up to its speed toward Tharos and make one weapon attack against a creature of Tharos’s choice.
> Ashen Detonation (Recharge 5–6): Tharos detonates a rune at a point he can see within 90 ft. Each creature in a 20-foot-radius sphere must make a DC 22 Dexterity saving throw, taking 45 (10d8) fire damage and 22 (4d10) force damage on a failed save, or half as much damage on a successful one.
>
> bonusActions:
> desc: Extra action economy block. Useful for “boss feel” and stress-testing wrap.
> Ember Step: Tharos teleports up to 30 ft. to an unoccupied space he can see. Creatures adjacent to the destination space take 7 (2d6) fire damage.
> Cloak Flare: Until the start of Tharos’s next turn, attacks against him are made with disadvantage unless the attacker is within 10 ft.
> Mark for Ruin: Tharos targets one creature he can see within 60 ft. The next time Tharos hits that creature before the end of his next turn, the hit deals an extra 18 (4d8) necrotic damage.
>
> reactions:
> desc: Interrupts. Include a link to test hover panels inside reaction text.
> Hellish Rebuke: When Tharos takes damage from a creature he can see within 60 ft., that creature must make a DC 20 Dexterity saving throw, taking 22 (5d8) fire damage on a failed save, or half as much on a success.
> Parry: Tharos adds 3 to his AC against one melee attack that would hit him. To do so, Tharos must see the attacker and be wielding his glaive.
> Brandlash: When a branded creature within 60 ft. hits Tharos, Tharos forces it to succeed on a DC 20 Constitution saving throw or take 10 (3d6) necrotic damage and become [[Frightened]] until the end of its next turn.
>
> legendaryActions:
> desc: This boss is designed for **large parties**. In Phase 2, Tharos may have **5 legendary actions** per round. Only one legendary action can be used at a time, and only at the end of another creature’s turn.
> Detect: Tharos makes a Wisdom (Perception) check.
> Glaive Swipe: Tharos makes one Infernal Glaive attack.
> Wing Buffet (Costs 2 Actions): Each creature within 15 ft. must succeed on a DC 21 Strength saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. Tharos can then fly up to half his flying speed.
> Ember Step (Costs 2 Actions): Tharos uses Ember Step.
> Ruinous Brand (Costs 3 Actions): One branded creature Tharos can see within 60 ft. takes 18 (4d8) necrotic damage and must succeed on a DC 20 Wisdom save or be compelled to move up to its speed (no opportunity attacks) to a point Tharos chooses.
>
> spells:
> desc: Optional “spell list” style section. These are written as entries to stress-test long lines and links.
> At will: [[Detect Magic]], [[Thaumaturgy]], [[Darkness]]
> 3/day each: [[Fireball]] (as a 6th-level spell), [[Dispel Magic]], [[Counterspell]]
> 1/day each: [[Plane Shift]] (self only), [[Wall of Fire]], [[Hold Monster]]
>
> feats:
> desc: Optional “feats” section for boss rules (homebrew or official). Mix of plain + link refs.
> [[Sentinel]]
> Great Weapon Master: When Tharos scores a critical hit, he can make one additional glaive attack as a bonus action.
> Infernal Athlete: Tharos ignores nonmagical difficult terrain and can climb at full speed.
>
> special:
> desc: “Anything else” catch-all section for mythic or phase changes. Make it long to force more layout tests.
> Mythic Threshold: The first time Tharos drops to 0 hit points, he instead drops to 1, extinguishes all nonmagical flames within 120 ft., and enters Phase 2. In Phase 2, his aura radius increases to 20 ft., and he gains an additional legendary action each round (total 5).
> Brazier Dependency: If all braziers in the arena are unlit, Tharos loses Magic Resistance and his fly speed.
> Lair Hazard — Falling Cinders: At initiative count 20 (losing initiative ties), burning cinders fall in three 10-foot squares Tharos can see within 120 ft. Creatures in a square must succeed on a DC 18 Dexterity saving throw or take 10 (3d6) fire damage and have their speed reduced by 10 ft. until the end of their next turn.
```

---

### Template (5e)

```md
> [!statblock] CREATURE NAME
>
> ruleset: dnd5e
> size: Medium
> creatureType: humanoid (any)
> alignment: neutral
> desc: Optional high-level description of the creature, its role, or encounter intent.
>
> ac: 15 (natural armor)
> hp: 45 (6d8 + 18)
> speed: 30 ft.
>
> abilities: STR 14 (+2), DEX 12 (+1), CON 16 (+3), INT 10 (+0), WIS 11 (+0), CHA 13 (+1)
> saves: Dex +3, Wis +2
> skills: Perception +4, Stealth +3
> resistances: —
> immunities: —
> vulnerabilities: —
> conditionImmunities: —
> senses: darkvision 60 ft., passive Perception 14
> languages: Common
> cr: 3 (700 XP) (+2)
>
> traits:
> desc: Passive or always-on abilities.
> Trait Name: Description text.
> [[Linked Trait]]
>
> actions:
> desc: Standard action options.
> Action Name: Attack or effect description.
> Multiattack: Description of multiple attacks.
>
> bonusActions:
> desc: Optional. Use for bosses or agile creatures.
> Bonus Action Name: Description.
>
> reactions:
> desc: Optional. Interrupt-style abilities.
> Reaction Name: Trigger and effect.
>
> legendaryActions:
> desc: Optional. Explain how many actions per round and any phase rules.
> Legendary Action Name: Effect.
> Another Legendary Action (Costs 2 Actions): Effect.
>
> spells:
> desc: Optional spellcasting section.
> At will: [[Spell]], [[Spell]]
> 3/day each: [[Spell]]
> 1/day: [[Spell]]
>
> feats:
> desc: Optional feats or feat-like abilities.
> [[Feat Name]]
> Feat Name: Custom rule text.
>
> special:
> desc: Catch-all for mythic traits, phase changes, lair effects, or encounter rules.
> Special Rule Name: Description.
```

---

## 🎲 Savage Worlds (SWADE) Statblocks

### Minimal Example

```md
> [!statblock] Skeleton
>
> ruleset: swade
> type: Undead
> desc: Animated bones bound by dark magic.
> attributes: Agi d6, Sma d4, Spi d4, Str d6, Vig d6
> skills: Fighting d6, Notice d4
> pace: 6
> parry: 5
> toughness: 7(2)
>
> special:
> - Undead: [[Undead]]
```

---

### Supported Top-Level Fields (SWADE)

| Key          | Example                     |
| ------------ | --------------------------- |
| `type`       | Wild Card                   |
| `desc`       | Short narrative description |
| `attributes` | Agi d10, Sma d8             |
| `skills`     | Shooting d8, Notice d6      |
| `pace`       | 6                           |
| `parry`      | 6                           |
| `toughness`  | 8(2)                        |
| `charisma`   | +2                          |

---

### Section Blocks (SWADE)

```md
edges:
hindrances:
special:
gear:
```

Each section:
- Supports desc:
- Supports links ([[Marksman]])
- Supports free-form text

Example:

```md
> edges:
> desc: Combat advantages earned through experience.
> - Marksman
> - Quick Draw
```

---

### Full Example (SWADE)

```md
> [!statblock] Kestrel Vane, Relic-Hunter of the Shattered Crown
> 
> ruleset: swade
> type: Human • Wild Card • Relic-Hunter
> desc: A “kitchen sink” SWADE statblock to stress-test **big cards**, **wrapping**, **section desc**, **link refs**, and **lots of entries**. Designed for long Edges/Hindrances/Special lists and verbose Gear.
>
> attributes: Agi d10, Sma d8, Spi d8, Str d6, Vig d8
> skills: Athletics d8, Battle d6, Boating d4, Fighting d8, Intimidation d6, Notice d10, Persuasion d6, Research d10, Riding d6, Shooting d10, Stealth d10, Survival d8, Taunt d6, Thievery d10, Tracking d8
> pace: 6
> parry: 7
> toughness: 9(2)
> cha: +1
>
> edges:
> desc: Edges are listed as entries; some are direct links, some have text after a link, some are plain text. All of these should wrap nicely.
> [[Quick Draw]]
> [[Marksman]]: Aim grants additional +1 to hit or negate 2 points of penalties.
> Ambidextrous: Ignore off-hand penalty when dual-wielding light weapons.
> Combat Reflexes: +2 to recover from being Shaken.
> Danger Sense: Notice roll at -2 to detect surprise attacks.
> Extraction: May withdraw from melee without triggering a free attack on a successful Agility roll.
> Strong Willed: +2 to resist and recover from Tests of Will.
> Steady Hands: Ignore 1 point of penalties from unstable platforms (vehicle / wind / poor footing).
> Trademark Weapon: +1 Fighting and Parry when using her relic-sabre “Glimmer”.
>
> hindrances:
> desc: Hindrances use entries and may include tags like (Major)/(Minor). Make sure your tag parsing still looks correct when long.
> Wanted (Major): Bounty posted in Zirham for “the theft of imperial reliquaries.”
> Curious (Minor): Must investigate strange arcana, even when it’s unwise.
> Vow (Minor): Never sell a relic to a necromancer or a slaver.
> Enemy (Major): The Crimson Duelists have sworn to take “Glimmer” back by force.
> Habit (Minor): Always taps the pommel twice before drawing a blade.
>
> special:
> desc: Special Abilities often contain reused rules. Here we test links, long descriptions, and pure label entries.
> Claws: Str+d4 (only while wearing the “Wyrm-Grip” gauntlet).
> [[Undead]]: If affected by necromancy backlash, Kestrel can temporarily gain Undead-like resistances for 1 round (GM fiat).
> Evasion: On a successful Agility roll, halve damage from area effects (if rules allow).
> Fleet-Footed: Rolls d10 instead of d6 when running.
> Go for the Throat: With a raise on Fighting, target the weakest armored location (narrative/setting).
> Relic-Sense: Once per scene, detect the direction of the nearest active relic within 1 mile.
> Shadow Mantle: In dim light, Stealth rolls are made at +2 and opponents suffer –1 to Notice.
> Size +1: Considered slightly larger due to exo-rig harness; affects some interactions.
> Silvered Ammunition: Shots ignore 1 point of supernatural damage resistance (setting rule).
>
> gear:
> desc: Gear entries are raw strings. Parentheses become “stats” visually in your card renderer, so include many variants.
> Relic Sabre “Glimmer” (Str+d6, Parry +1, counts as magical vs cursed entities)
> Heavy Pistol (Range 12/24/48, Damage 2d6, AP 1, RoF 1)
> Long Rifle (Range 24/48/96, Damage 2d8, AP 2, RoF 1, Scope +2 at medium/long)
> Throwing Knives x6 (Range 3/6/12, Damage Str+d4)
> Leather Armor (Armor +2, worn)
> Wyrm-Grip Gauntlet (Counts as Claws when activated; requires a Spirit roll to safely disengage)
> Climber’s Kit (Rope, pitons, chalk, harness, gloves)
> Field Journal (Maps, cipher notes, charcoal rubbings of sigils)
> Relic Satchel (Lead-lined pockets; prevents casual detection)
> Smoke Bombs x3 (Creates Medium Obscurement in a Small Burst Template for 1d4 rounds)
> Healing Poultices x2 (Treat as a Healing skill roll at +1 once per poultice)
> Survival Kit (Rations, water skin, flint, tinder, needle, thread, spare cloak)
```

---

### Template (SWADE)

```md
> [!statblock] CHARACTER NAME
>
> ruleset: swade
> type: Species • Wild Card / Extra • Archetype
> desc: Optional short narrative description. Use this to summarise role, vibe, or purpose.
>
> attributes: Agi d6, Sma d6, Spi d6, Str d6, Vig d6
> skills: Skill d6, Another Skill d8, Notice d6
> pace: 6
> parry: 5
> toughness: 6(0)
> cha: 0
>
> edges:
> desc: Optional description for the section. Explains how these edges work together or special rulings.
> [[Edge Name]]
> Edge Name: Optional rules text or clarification.
> Another Edge
>
> hindrances:
> desc: Optional description. Use (Major)/(Minor) in names if desired.
> Hindrance Name (Minor): Optional flavour or reminder text.
> Another Hindrance (Major)
>
> special:
> desc: Special abilities, passive effects, or setting rules. Can include links.
> Ability Name: Description text.
> [[Linked Ability]]: Optional extra text.
> Passive Trait
>
> gear:
> desc: Equipment carried. Text in parentheses is rendered as stats.
> Item Name (Stats, bonuses, notes)
> Another Item
> Consumable x3 (Effect summary)
```

---

## 🔗 Links & Hover Previews

Any [[Page Name]]:
- Links to the page
- Shows a hover preview if metadata exists

Recommended metadata keys:
- summary
- description
- excerpt

---

## ⚠️ Common Pitfalls

- Section headers must end with `:`
- Bullets must start with `-`
- Avoid inline headers (`Traits: blah`)
- `ruleset:` is mandatory