<template>
  <div class="ReceiptInput">
    <v-row>
      <v-col md="6" sm="12">
        <div
          class="receipt-image-container"
          :style="receiptImageContainerStyle"
        >
          <v-img
            :src="receiptImage"
          />
        </div>
      </v-col>
      <v-col md="6" sm="12">
        <v-list-item-group
          :style="paragraphContainerStyle"
        >
          <v-list-item v-for="(paragraph, i) in paragraphs" :key="i">
            <v-chip v-for="(c, j) in paragraph" :key="j"
              outlined
              label
              small
              class="mr-1"
            >
              {{ c }}
            </v-chip>
          </v-list-item>
        </v-list-item-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="2" sm="6">

        <v-menu
          ref="menu"
          v-model="ui.showDatePicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="ui.date"
              label="日付"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="ui.date"
            :active-picker.sync="ui.activePicker"
            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
            min="2020-01-01"
            @change="save"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col md="2" sm="6">
        <v-text-field
          label="いくら"
          dense
          hide-details
        />
      </v-col>
      <v-col md="3" sm="12">
        <v-text-field
          label="どこで"
          dense
          hide-details
        />
      </v-col>
      <v-col md="5" sm="12">
        <v-text-field
          label="メモ"
          dense
          hide-details
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data () {
    const receiptInformation = require('@/assets/receipt/receipt.json');
    let textAnnotations = receiptInformation.textAnnotations;
    textAnnotations = textAnnotations.splice(1);

    return {
      receiptImage: require('@/assets/receipt/receipt.jpg'),
      receiptInformation,
      textAnnotations,
      ui: {
        showDatePicker: false,
        activePicker: null,
        date: null,
      }
    }
  },
  mounted () {
    // for(const textAnnotation of this.textAnnotations) {
    //   const { description } = textAnnotation
    // }
  },
  computed: {
    paragraphs () {
      const items = []
      const blocks = this.receiptInformation.fullTextAnnotation.pages[0].blocks
      for(const block of blocks) {
        for(const paragraph of block.paragraphs) {
          const texts = []
          for(const word of paragraph.words) {
            const text = word.symbols.reduce((a, v) => a += v.text, "")
            texts.push(text)
          }
          items.push(texts)
        }
      }
      return items
    },
    receiptImageContainerStyle () {
      return {
        height: this.$vuetify.breakpoint.mobile ? '30vh' : '70vh'
      }
    },
    paragraphContainerStyle () {
      return {
        height: this.$vuetify.breakpoint.mobile ? 'calc(60vh - 168px)' : '70vh'
      }
    }
  },
  methods: {
    save (date) {
      // TODO
    }
  }
}
</script>
<style lang="scss" scoped>

.receipt-image-container {
  overflow: auto;
}
.v-list-item-group {
  overflow: auto;
  .v-list-item {
    padding-top: .25rem;
    padding-bottom: .1rem;
    min-height: inherit;

    border-bottom: 1px solid #ccc;
  }
}
</style>
