<!-- Please remove this file from your project -->
<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="searchTitle"
          label="タイトル"
          hide-details
          dense
        />
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          v-model="selectedMakers"
          :items="makers"
          label="メーカー"
          multiple
          chips
          small-chips
          dense
        />
      </v-col>
    </v-row>
    <v-data-table
      :headers="gameHeaders"
      :items="filteredGames"
      height="calc(100vh - 216px)"
      fixed-header
      hide-default-footer
      disable-pagination
      dense
    >
      <template #[`item.TitleName`]="{ item }">
        <div class="d-flex __clickable" @click="onShowPage(item)">
          <v-img
            :src="item.ScreenshotImgURL"
            max-width="120"
          />
          <div>
            {{ item.TitleName }}
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
const BASE_URL = 'https://store-jp.nintendo.com/list/software/'

export default {
  name: 'GameList',
  data: () => {
    const games = require('~/assets/data/games.json')
      .map((g) => {
        g.TitleName = String(g.TitleName)
        g._price = Number(g.Price.replace(/[^0-9a-z]/gi, ''))
        return g
      })

    const makers = games.map(g => g.MakerName).sort()

    return {
      games,
      makers,
      searchTitle: '',
      selectedMakers: [],
      selectedGame: null
    }
  },
  computed: {
    gameHeaders () {
      return [
        { text: 'タイトル', value: 'TitleName' },
        { text: 'メーカー', value: 'MakerName' },
        { text: '価格', value: '_price', align: 'end' },
        { text: '発売日', value: 'SalesDate', align: 'end' }
      ]
    },
    filteredGames () {
      let games = this.games
      if (this.selectedMakers.length > 0) {
        games = games.filter(g => this.selectedMakers.includes(g.MakerName))
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
    }
  }
}
</script>
<style lang="scss" scoped>
.__clickable {
  cursor: pointer;
}
</style>
