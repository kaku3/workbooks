<!-- Please remove this file from your project -->
<template>
  <div>
    <v-data-table
      :headers="gameHeaders"
      :items="games"
      height="80vh"
      fixed-header
      hide-default-footer
      disable-pagination
    >
      <template #[`item.TitleName`]="{ item }">
        {{ item.TitleName }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'GameList',
  data: () => {
    const games = require('~/assets/data/games.json')
      .map((g) => {
        g._price = Number(g.Price.replace(/[^0-9a-z]/gi, ''))
        return g
      })

    const makers = games.map(g => g.MakerName).sort()

    return {
      games,
      makers
    }
  },
  computed: {
    gameHeaders () {
      return [
        { text: 'タイトル', value: 'TitleName' },
        { text: 'メーカー', value: 'MakerName' },
        { text: '価格', value: '_price' },
        { text: '発売日', value: 'SalesDate' }
      ]
    }
  }
}
</script>
