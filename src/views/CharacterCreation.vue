<template>
  <div class="creation-root">
    <Transition name="fade-in" appear>
      <div v-if="step === 'intro'" class="intro-overlay">
        <div class="intro-content">
          <h1 class="intro-title">醒来...</h1>
          <p class="intro-text">
            记忆像破碎的镜片，你记不清自己是谁，<br/>
            也记不清是如何来到这里的。<br/>
            唯一清晰的，是空气中挥之不去的铁锈味。
          </p>
          <button class="start-btn" @click="step = 'naming'">
            <span>回忆起一些事...</span>
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>
    </Transition>

    <div v-if="step !== 'intro'" class="creation-panel">
      <!-- Header -->
      <header class="cp-header">
        <div class="cp-step-indicator">
          <span v-for="s in ['naming', 'traits', 'stats']" :key="s" 
                :class="['step-dot', { active: step === s, passed: isStepPassed(s) }]"></span>
        </div>
        <h2 class="cp-title">{{ stepTitle }}</h2>
      </header>

      <main class="cp-main scrollbar-hide">
        <!-- Step 1: Naming & Gender -->
        <div v-if="step === 'naming'" class="cp-content">
          <div class="form-group">
            <label class="form-label">你似乎记得，他们叫你...</label>
            <input 
              v-model="tempPlayer.name" 
              type="text" 
              placeholder="输入你的名字" 
              class="form-input"
              maxlength="12"
            />
          </div>
          <div class="form-group">
            <label class="form-label">性别倾向</label>
            <div class="gender-grid">
              <button 
                v-for="g in genders" :key="g.id"
                :class="['gender-btn', { active: tempPlayer.gender === g.id }]"
                @click="tempPlayer.gender = g.id"
              >
                <component :is="g.icon" :size="20" />
                <span>{{ g.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Traits -->
        <div v-if="step === 'traits'" class="cp-content">
          <p class="cp-desc">选择两个能代表你性格的特质，这将影响你在某些情境下的反应。</p>
          <div class="trait-grid">
            <button 
              v-for="t in traits" :key="t.id"
              :class="['trait-card', { active: tempPlayer.traits.includes(t.id), disabled: isTraitDisabled(t.id) }]"
              @click="toggleTrait(t.id)"
            >
              <div class="trait-header">
                <span class="trait-name">{{ t.label }}</span>
                <component :is="t.icon" :size="14" class="trait-ico" />
              </div>
              <p class="trait-desc">{{ t.description }}</p>
            </button>
          </div>
        </div>

        <!-- Step 3: Stats -->
        <div v-if="step === 'stats'" class="cp-content">
          <p class="cp-desc">你残存的身体记忆告诉你，你擅长...</p>
          <div class="points-indicator">
            剩余点数: <span class="points-val">{{ remainingPoints }}</span>
          </div>
          <div class="stat-rows">
            <div v-for="s in statsConfig" :key="s.id" class="stat-row">
              <div class="stat-info">
                <component :is="s.icon" :size="16" class="stat-ico" />
                <span class="stat-label">{{ s.label }}</span>
              </div>
              <div class="stat-control">
                <button class="stat-btn" @click="changeStat(s.id, -1)" :disabled="tempPlayer.stats[s.id] <= 3">
                  <Minus :size="14" />
                </button>
                <span class="stat-val">{{ tempPlayer.stats[s.id] }}</span>
                <button class="stat-btn" @click="changeStat(s.id, 1)" :disabled="remainingPoints <= 0 || tempPlayer.stats[s.id] >= 10">
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer class="cp-footer">
        <button v-if="step !== 'naming'" class="cp-nav-btn back" @click="prevStep">
          <ChevronLeft :size="18" />
          <span>返回</span>
        </button>
        <button class="cp-nav-btn next" @click="nextStep" :disabled="!isCurrentStepValid">
          <span>{{ step === 'stats' ? '进入噩梦' : '继续' }}</span>
          <ChevronRight :size="18" />
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  ChevronRight, ChevronLeft, User, UserPlus, HelpCircle, 
  Zap, Brain, Shield, Minus, Plus, Eye, Skull, Heart
} from 'lucide-vue-next'
import type { PlayerStats } from '../stores/game'

const emit = defineEmits<{
  (e: 'complete', data: any): void
}>()

const step = ref<'intro' | 'naming' | 'traits' | 'stats'>('intro')

const tempPlayer = reactive({
  name: '',
  gender: 'male',
  traits: [] as string[],
  stats: {
    strength: 5,
    intelligence: 5,
    dexterity: 5,
    hp: 100,
    maxHp: 100,
    sanity: 100,
    maxSanity: 100,
  } as PlayerStats
})

const remainingPoints = ref(5)

const genders = [
  { id: 'male', label: '男性', icon: User },
  { id: 'female', label: '女性', icon: UserPlus },
  { id: 'non-binary', label: '未知', icon: HelpCircle },
]

const traits = [
  { id: 'stoic', label: '冷静', icon: Eye, description: '理智上限提高，对恐怖事件的抵抗力更强。' },
  { id: 'agile', label: '圆滑', icon: Zap, description: '更擅长与NPC打交道，容易获得他人的信任。' },
  { id: 'paranoid', label: '偏执', icon: Skull, description: '更容易发现隐藏的线索，但理智恢复速度较慢。' },
  { id: 'tough', label: '坚韧', icon: Heart, description: '生命上限提高，在体力活中表现出色。' },
]

const statsConfig = [
  { id: 'strength' as keyof PlayerStats, label: '力量', icon: Shield },
  { id: 'intelligence' as keyof PlayerStats, label: '智力', icon: Brain },
  { id: 'dexterity' as keyof PlayerStats, label: '敏捷', icon: Zap },
]

const stepTitle = computed(() => {
  if (step.value === 'naming') return '身份印记'
  if (step.value === 'traits') return '本能特质'
  if (step.value === 'stats') return '身体机能'
  return ''
})

const isStepPassed = (s: string) => {
  const order = ['naming', 'traits', 'stats']
  return order.indexOf(order.find(o => o === s)!) < order.indexOf(step.value)
}

const isCurrentStepValid = computed(() => {
  if (step.value === 'naming') return tempPlayer.name.trim().length > 0
  if (step.value === 'traits') return tempPlayer.traits.length === 2
  if (step.value === 'stats') return remainingPoints.value === 0
  return true
})

const isTraitDisabled = (id: string) => {
  return tempPlayer.traits.length >= 2 && !tempPlayer.traits.includes(id)
}

const toggleTrait = (id: string) => {
  const idx = tempPlayer.traits.indexOf(id)
  if (idx > -1) {
    tempPlayer.traits.splice(idx, 1)
  } else if (tempPlayer.traits.length < 2) {
    tempPlayer.traits.push(id)
  }
}

const changeStat = (id: keyof PlayerStats, delta: number) => {
  if (delta > 0 && remainingPoints.value > 0) {
    (tempPlayer.stats[id] as number)++
    remainingPoints.value--
  } else if (delta < 0 && (tempPlayer.stats[id] as number) > 3) {
    (tempPlayer.stats[id] as number)--
    remainingPoints.value++
  }
}

const nextStep = () => {
  if (step.value === 'naming') step.value = 'traits'
  else if (step.value === 'traits') step.value = 'stats'
  else if (step.value === 'stats') {
    // Apply trait effects to stats
    if (tempPlayer.traits.includes('stoic')) {
      tempPlayer.stats.maxSanity += 20
      tempPlayer.stats.sanity = tempPlayer.stats.maxSanity
    }
    if (tempPlayer.traits.includes('tough')) {
      tempPlayer.stats.maxHp += 20
      tempPlayer.stats.hp = tempPlayer.stats.maxHp
    }
    emit('complete', JSON.parse(JSON.stringify(tempPlayer)))
  }
}

const prevStep = () => {
  if (step.value === 'traits') step.value = 'naming'
  else if (step.value === 'stats') step.value = 'traits'
}
</script>

<style scoped>
.creation-root {
  position: fixed;
  inset: 0;
  background-color: var(--bg-base);
  color: var(--text-primary);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-image: radial-gradient(circle, rgba(44,110,168,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* ── Intro ── */
.intro-overlay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.intro-content {
  max-width: 500px;
  animation: fadeInDown 1.2s ease-out;
}

.intro-title {
  font-family: var(--font-narrative);
  font-size: 2.4rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--text-primary);
  letter-spacing: 4px;
}

.intro-text {
  font-family: var(--font-narrative);
  font-size: 1.1rem;
  line-height: 2;
  color: var(--text-secondary);
  margin-bottom: 50px;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--accent-bright);
  font-weight: 600;
  transition: all 0.3s;
}

.start-btn:active {
  transform: scale(0.95);
  background-color: var(--bg-elevated);
}

/* ── Panel ── */
.creation-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.cp-header {
  padding: 40px 20px 20px;
  text-align: center;
}

.cp-step-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.step-dot {
  width: 30px;
  height: 4px;
  background-color: var(--bg-elevated);
  border-radius: 2px;
  transition: all 0.4s;
}

.step-dot.active {
  background-color: var(--accent-primary);
  width: 50px;
}

.step-dot.passed {
  background-color: var(--accent-green);
}

.cp-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.cp-main {
  flex: 1;
  padding: 0 24px;
  overflow-y: auto;
}

.cp-content {
  animation: fadeInUp 0.5s ease-out both;
}

.cp-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

/* ── Forms ── */
.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-family: var(--font-mono);
}

.form-input {
  width: 100%;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--text-primary);
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: var(--accent-primary);
}

.gender-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.gender-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 10px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: all 0.3s;
}

.gender-btn.active {
  background-color: var(--bg-elevated);
  border-color: var(--accent-primary);
  color: var(--accent-bright);
}

/* ── Traits ── */
.trait-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.trait-card {
  text-align: left;
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.3s;
}

.trait-card.active {
  border-color: var(--accent-primary);
  background-color: var(--bg-elevated);
}

.trait-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trait-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.trait-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}

.trait-ico { color: var(--accent-primary); }

.trait-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

/* ── Stats ── */
.points-indicator {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
  text-align: right;
}

.points-val {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-amber);
}

.stat-rows {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.stat-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-ico { color: var(--text-muted); }
.stat-label { font-weight: 600; font-size: 0.95rem; }

.stat-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
}

.stat-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stat-val {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
}

/* ── Footer ── */
.cp-footer {
  padding: 24px;
  display: flex;
  gap: 16px;
}

.cp-nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 52px;
  border-radius: var(--radius-md);
  font-weight: 700;
  transition: all 0.3s;
}

.cp-nav-btn.back {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  flex: 0.4;
}

.cp-nav-btn.next {
  background-color: var(--accent-primary);
  color: white;
}

.cp-nav-btn.next:disabled {
  background-color: var(--bg-elevated);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* ── Animations ── */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-enter-active {
  transition: opacity 1s ease;
}
.fade-in-enter-from {
  opacity: 0;
}
</style>
