<template>
  <div class="ReceiptInput">
    <v-row>
      <v-col cols="6">
        <v-img
          :src="receiptImage"
        >
        </v-img>
      </v-col>
      <v-col cols="6">
        <v-list-item-group>
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
      textAnnotations
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
            texts.push(text);
          }
          items.push(texts);
        }
      }
      return items;
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.v-list-item-group {
  height: 80vh;
  overflow: auto;
  .v-list-item {
    padding-top: .25rem;
    padding-bottom: .1rem;
    min-height: inherit;

    border-bottom: 1px solid #ccc;
  }
}
</style>
