<template>
  <div class="ReceiptInput">
    <v-row>
      <v-col cols="12">
        <div
          ref="receiptImageContainer"
          :style="receiptImageContainerStyle"
          class="receipt-image-container grey"
        >
          <panZoom
            id="receipt-image-panzoom"
            selector=".zoomable"
          >
            <div class="zoomable">
              <img :src="receiptImage.src"/>
              <svg :width="receiptImage.width" :height="receiptImage.height" :viewBox="`0 0 ${receiptImage.width} ${receiptImage.height}`">
                <polygon v-for="(paragraph, i) in paragraphs" :key="i"
                  :points="toPolygonPoints(paragraph.vertices)"
                  fill="none"
                  stroke-width="4"
                  stroke="yellow"
                />
              </svg>
            </div>
          </panZoom>
        </div>
      </v-col>

<!-- list 表示
      <v-col md="2" sm="12">
        <div class="input-list" :style="paragraphContainerStyle">
          <v-list-item v-for="(paragraph, i) in paragraphs" :key="i"
            ripple
            @click="onClickParagraph(paragraph)"
          >
            <v-chip v-for="(text, j) in paragraph.texts" :key="j"
              color="primary"
              outlined
              label
              small
              class="mr-1"
              @click.stop="onClickChip(text)"
            >
              {{ text }}
            </v-chip>
          </v-list-item>
        </div>
      </v-col>
-->
    </v-row>
    <v-row>
      <v-col cols="6" sm="6" md="2">

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
            no-title
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ui.showDatePicker = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menu.save(ui.date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="6" sm="6" md="2">
        <v-text-field
          label="いくら"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-text-field
          label="どこで"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="12" md="5">
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
import panzoom from 'panzoom';
import { DateTime } from 'luxon';
import DrawingUtil from '~/scripts/DrawingUtil'

export default {
  data () {
    const receiptInformation = require('@/assets/receipt/receipt.json');
    let textAnnotations = receiptInformation.textAnnotations;
    textAnnotations = textAnnotations.splice(1);

    const dt = DateTime.now().setZone('Asia/Tokyo');

    return {
      receiptImage: {
        src: require('@/assets/receipt/receipt.jpg'),
        width: 0,
        height: 0
      },
      receiptInformation,
      textAnnotations,
      ui: {
        showDatePicker: false,
        activePicker: null,
        date: dt.toFormat('yyyy-MM-dd'),
      }
    }
  },
  mounted () {
    this.receiptImagePanZoom = panzoom(document.getElementById('receipt-image-panzoom'))

    const img = new Image()
    img.onload = () => {
      this.receiptImage.width = img.width
      this.receiptImage.height = img.height

      const containerWidth = this.$refs.receiptImageContainer.clientWidth;
      const containerHeight = this.$refs.receiptImageContainer.clientHeight;

      const zoom = (img.width > containerWidth) ? (containerWidth / img.width) : (img.width / containerWidth)

      this.receiptImagePanZoom.zoomTo((containerWidth - (img.width * zoom)) / 2, -img.height * 0.6 * zoom, zoom)
    }
    img.src = this.receiptImage.src
  },
  computed: {
    paragraphs () {
      const items = []
      const blocks = this.receiptInformation.fullTextAnnotation.pages[0].blocks
      for(const block of blocks) {
        for(const paragraph of block.paragraphs) {
          const texts = []
          let vertices = []
          for(const word of paragraph.words) {
            const text = word.symbols.reduce((a, v) => a += v.text, "")
            texts.push(text)

            vertices.push(word.boundingBox.vertices)
          }
          vertices = DrawingUtil.toConvexHull(vertices.flatMap(v => v))
          items.push({
            texts,
            vertices
          })
        }
      }
      return items
    },
    receiptImageContainerStyle () {
      return {
        height: this.$vuetify.breakpoint.mobile ? 'calc(90vh - 144px)' : 'calc(90vh - 48px)'
      }
    },
    paragraphContainerStyle () {
      return {
        height: this.$vuetify.breakpoint.mobile ? 'calc(30vh - 80px)' : '70vh'
      }
    },
  },
  methods: {
    toPolygonPoints (vertices) {
      return vertices.reduce((a, v) => a + `${v.x},${v.y} `, "")
    },

    onClickParagraph(paragraph) {
      console.log(paragraph);
    },
    onClickChip(c) {
      console.log(c);
    }
  }
}
</script>
<style lang="scss" scoped>

.receipt-image-container {
  overflow: hidden;

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.input-list {
  overflow: auto;
  .v-list-item {
    padding-top: .25rem;
    padding-bottom: .1rem;
    min-height: inherit;

    border-bottom: 1px solid #ccc;
  }
}
</style>
