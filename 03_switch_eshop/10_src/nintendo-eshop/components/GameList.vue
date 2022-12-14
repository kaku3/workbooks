<template>
  <div>
    <v-row>
      <v-col cols="2" class="teal lighten-5">
        <v-text-field
          v-model="searchTitle"
          label="タイトル"
          prepend-icon="mdi-magnify"
          hide-details
          dense
        />
        <v-autocomplete
          v-model="selectedMaker"
          :items="makers"
          label="メーカー"
          chips
          small-chips
          clearable
          dense
          class="mt-8"
        />
        <v-autocomplete
          v-model="selectedCategories"
          :items="categories"
          label="カテゴリ"
          multiple
          chips
          small-chips
          deletable-chips
          clearable
          dense
          class="mt-8"
        />
        <v-autocomplete
          v-model="selectedPlayers"
          :items="players"
          label="プレイ人数"
          multiple
          chips
          small-chips
          deletable-chips
          clearable
          dense
          class="mt-8"
        />
        <v-select
          v-model="selectedMinPrice"
          :items="PRICES"
          label="価格(MIN)"
          clearable
          dense
          class="mt-8"
        />
        <v-select
          v-model="selectedMaxPrice"
          :items="PRICES"
          label="価格(MAX)"
          clearable
          dense
          class="mt-4"
        />
      </v-col>
      <v-col cols="10">
        <v-data-table
          :headers="gameHeaders"
          :items="filteredGames"
          :footer-props="{
            'items-per-page-options': [ 200 ]
          }"
          :ites-per-page="200"
          height="calc(100vh - 192px)"
          fixed-header
          dense
        >
          <template #[`item.TitleName`]="{ item }">
            <div class="d-flex __clickable" @click="onShowPage(item)">
              <v-img
                :src="`/images/eshop/games/${item.InitialCode}.jpg`"
                max-width="172"
              />
              <div>
                <div class="text-h6 pa-1">
                  {{ item.TitleName }}
                </div>
                <div class="mt-2">
                  <v-chip
                    v-for="(c, i) in item._categories"
                    :key="i"
                    x-small
                    class="mx-1 mb-1"
                    @click.stop="onClickCategory(c)"
                  >
                    {{ c }}
                  </v-chip>
                </div>
              </div>
            </div>
          </template>
          <template #[`item._players`]="{ item }">
            <div
              v-for="(p, i) in item._players"
              :key="i"
              class="d-flex"
            >
              <div class="__players__key">
                {{ p.key }}
              </div>
              <div class="__players__value">
                {{ p.value }}
              </div>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GAMES from '~/assets/eshop/games.json'
import DETAILS from '~/assets/eshop/index.js'

const BASE_URL = 'https://store-jp.nintendo.com/list/software/'

// 最大プレイ人数を取得
function maxPlayerCount (v) {
  const counts = v.replace('人', '').split('〜').map(v => Number(v)).filter(v => !isNaN(v))
  const count = counts.reduce((a, v) => Math.max(a, Number(v)), 0)
  return count
}

export default {
  name: 'GameList',
  data: () => {
    const PRICES = ['500', '1000', '1500', '2000', '3000', '4000', '5000']

    const games = GAMES
      .map((g) => {
        const detail = DETAILS[g.InitialCode]
        g.TitleName = String(g.TitleName)
        g._price = Number(g.Price.replace(/[^0-9a-z]/gi, ''))
        g._categories = detail.categories
        g._players = detail.players
        return g
      })
    const makers = games.map(g => g.MakerName).sort()
    const categories = Array.from(new Set(games.flatMap(g => g._categories))).sort()
    const players = Array.from(new Set(games.flatMap(g => g._players).map(p => p.value))).sort((v0, v1) => {
      // 最大プレイ人数順でソート
      return maxPlayerCount(v0) - maxPlayerCount(v1)
    })
    return {
      PRICES,
      games,
      makers,
      categories,
      players,
      searchTitle: '',
      selectedMaker: null,
      selectedCategories: [],
      selectedPlayers: [],
      selectedMinPrice: '',
      selectedMaxPrice: '',
      selectedGame: null
    }
  },
  computed: {
    gameHeaders () {
      return [
        { text: 'タイトル', value: 'TitleName' },
        { text: 'メーカー', value: 'MakerName' },
        { text: '価格', value: '_price', align: 'end' },
        { text: '発売日', value: 'SalesDate', align: 'end' },
        { text: 'プレイ人数', value: '_players' }
      ]
    },
    filteredGames () {
      let games = this.games

      if (this.selectedMaker) {
        games = games.filter(g => this.selectedMaker === g.MakerName)
      }
      if (this.selectedCategories.length > 0) {
        games = games.filter(g => g._categories.some(c => this.selectedCategories.includes(c)))
      }
      if (this.selectedPlayers.length > 0) {
        games = games.filter(g => g._players.some(p => this.selectedPlayers.includes(p.value)))
      }
      if (this.selectedMinPrice !== '') {
        const price = Number(this.selectedMinPrice)
        games = games.filter(g => g._price >= price)
      }
      if (this.selectedMaxPrice !== '') {
        const price = Number(this.selectedMaxPrice)
        games = games.filter(g => g._price <= price)
      }
      if (this.searchTitle !== '') {
        games = games.filter(g => ~g.TitleName.indexOf(this.searchTitle))
      }
      return games
    },
    showPageUrl () {
      if (!this.selectedGame) {
        return ''
      }
      return BASE_URL + this.selectedGame.LinkURL.replace('/titles/', '') + '.html'
    }
  },
  methods: {
    onShowPage (game) {
      this.selectedGame = game
      window.open(this.showPageUrl, '_blank')
    },
    onClickCategory (c) {
      if (!this.selectedCategories.includes(c)) {
        this.selectedCategories.push(c)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.__clickable {
  cursor: pointer;
}
.__players__key {
  width: 144px;
}
.__players__value {
  width: 60px;
}
</style>
