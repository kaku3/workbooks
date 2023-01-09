<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <ReceiptInput />
    </v-col>
  </v-row>
</template>

<script>
import ReceiptInput from '~/components/ReceiptInput.vue';

export default {
    name: "IndexPage",
    components: { ReceiptInput }
}
</script>
