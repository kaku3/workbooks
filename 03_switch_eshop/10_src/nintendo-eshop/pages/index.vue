<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <GameList />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import GameList from '../components/GameList.vue'

export default {
  name: 'IndexPage',
  components: { GameList }
}
</script>
