<script setup>
import Card from "./Card.vue"

defineProps({
  items: Array
})

</script>

<template>
    <div class="tours__list">
      <div class="card-grid">
        <Card
          v-for="item in items"
          :main_photo="item.main_photo"
          :title="item.title"
          :netto_price="item.netto_price"
          :customers_review_rating="item.customers_review_rating"
          :reviews="item.reviews"
        />
      </div>
    </div>
</template>
  
<style scoped>
.tours__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
  
.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 50px;
    margin: 0 auto;
    place-items: center;
}

@media (max-width: 1155px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
    .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
  </style>