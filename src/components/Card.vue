<script setup>
import { computed } from 'vue';
import StarRating from './StarRating.vue';

const props = defineProps({
  main_photo: Object,
  title: String,
  netto_price: String,
  customers_review_rating: Number,
  reviews: Number,
});

/*
Так как netto_price (тип данных строка) содержит в себе цену с формате float и валюту. 
А по макету нам нужна цена без дробной части и валюта, я реализовал функцию для преобразования цены из float в integer.
*/
const formattedNettoPrice = computed(() => {
  const priceString = props.netto_price;
  if (!priceString) {
    return '';
  }

  const priceParts = priceString.split(' ');

  if (priceParts.length !== 2) {
    return priceString;
  }


  const price = parseFloat(priceParts[0]);
  if (isNaN(price)) {
    return priceString;
  }

  const roundedPrice = Math.floor(price);
  const currency = priceParts[1];
    
  return `${roundedPrice} ${currency}`;
});
</script>

<template>
  <div class="tour__card">
    <div class="tour__picture">
      <img class="tour__picture__img" :src="main_photo?.big" alt="" />
    </div>
    <div class="tour__rating">
        <StarRating :rating="customers_review_rating"/>
        <span class="tour__rating__score">{{  customers_review_rating }}</span>
        <span class="tour__rating__reviewers">({{ reviews }})</span>
    </div>
    <div class="tour__title">
        <span class="tour__title__text">{{ title }}</span>
    </div>
    <div class="tour__price">
        <span class="tour__price__text">от {{ formattedNettoPrice }}</span>
        <span class="tour__price__addition">за экскурсию</span>
    </div>
  </div>
</template>

<style scoped>
.tour__card {
  display: flex;
  flex-direction: column;
  width: 345px;
  height: 332px;
}

.tour__picture {
    margin-bottom: 10px;
}

.tour__picture__img {
  width: 345px;
  height: 200px;
  border-radius: 5px;
  opacity: 95%;
}

.tour__rating {
    display: flex;
    align-items: center;
    margin-left: 3px;
    margin-bottom: 5px;
}

.tour__rating__score {
    margin-left: 3px;
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-size: 14px;
    font-weight: 400; 
    color: black;  
}

.tour__rating__reviewers {
    margin-left: 3px;
    margin-top: 1px;
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-size: 12px;
    font-weight: 400;
    color: #999;
}

.tour__title {
    margin-bottom: 10px;
}

.tour__title__text {
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: black;
}

.tour__price {
    display: flex;
    flex-direction: column;
}

.tour__price__text {
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-size: 22px;
    font-weight: 700;
    color: #444;
}

.tour__price__addition {
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-size: 12px;
    font-weight: 400;
    color: #999;
}

</style>