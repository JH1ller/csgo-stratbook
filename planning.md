### Map
- name: string
- active: boolean
- image: string | URL

---

### Strat
- name: string
- type: Pistol | Force | Buyround
- map: Map
- team: Team
- side: CT | T
- active: boolean
- videoLink?: string | URL
- note: string
- createdBy: Player
- createdAt: Date
- modifiedBy?: Player
- modifiedAt?: Date

---

### Step
- player: Player
- strat: Strat
- grenades?: Array\<"Grenade" | "Molotov" | "Flashbang" | "Smoke">
- description: string
- note: string

---

### Player
- name: string
- team: Team
- role: "AWP" | "IGL" | "Entry" | "Support" | "Rifle"
- avatar?: string | URL

### Team
- name: string
- avatar: string