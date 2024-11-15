<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CardList from '@/components/CardList.vue';

const cities = ref([]);
const tours = ref([]);
const showDropdown = ref(false);
const selectedTour = ref(null);
const selectedCityName = ref(null);
const selectedCityId = ref(null);

//Получаем города
onMounted(async () => {
  try {
    const { data } = await axios.get('https://thingproxy.freeboard.io/fetch/https://api.sputnik8.com/v1/cities', { //Использовал proxy потому что CORS сервера не давал доступ к ресурсам с моего домена
      params: {
        api_key: '873fa71c061b0c36d9ad7e47ec3635d9',
        username: 'frontend@sputnik8.com',
        //fields: 'name' или select: 'name' - Пытался сразу получить только названия городов, а не весь объект, но видимо ваш сервер не имеет такого функционала, поэтому придется обрабатывать объект уже на клиенте
      }
    });
    cities.value = data.map(city => ({ name: city.name, id: city.id }));
  } catch (error) {
    console.error('Ошибка при получении городов:', error);
  }
});

//Получаем экскурсии
onMounted(async () => {
  try {
    const { data } = await axios.get('https://thingproxy.freeboard.io/fetch/https://api.sputnik8.com/v1/products', {
      params: {
        api_key: '873fa71c061b0c36d9ad7e47ec3635d9',
        username: 'frontend@sputnik8.com',
      }
    });
    tours.value = data.map(tour => ({ 
      main_photo: tour.main_photo, 
      title: tour.title,
      netto_price: tour.netto_price,
      city_id: tour.city_id,
      customers_review_rating: tour.customers_review_rating,
      reviews: tour.reviews
    }))
  } catch (error) {
    console.error('Ошибка при получении экскурсий:', error);
  }
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCity = (city) => {
  selectedCityName.value = city.name; 
  selectedCityId.value = city.id;
  showDropdown.value = false;
};
</script>

<template>
  <body class="homePage">
    <div class="homePage__container">
      <div class="homePage__title">
        <h1 class="homePage__title__text">Экскурсии по всему миру</h1>
      </div>
      <div class="homePage__searchBar">
        <div class="search__block">
          <input type="text" class="search__input" v-model="selectedTour" placeholder="Введите название экскурсии">
        </div>
        <div class="filter__block" @click="toggleDropdown">
          <span class="filter__text">{{ selectedCityName ? selectedCityName : 'Выбрать город' }}</span>
          <div class="filter__button">
            <svg class="filter__button__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.20711 7C4.76165 7 4.53857 7.53857 4.85355 7.85355L9.64645 12.6464C9.84171 12.8417 10.1583 12.8417 10.3536 12.6464L15.1464 7.85355C15.4614 7.53857 15.2383 7 14.7929 7H5.20711Z" fill="#DDDDDD"/>
            </svg>
          </div>
          <div class="filter__dropdown" v-if="showDropdown">
            <div class="dropdown-scroll">
              <ul class="dropdown-scroll__list">
                <li class="dropdown-scroll__item" v-for="city in cities" :key="city.id" @click.stop="selectCity(city)">
                  {{ city.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <CardList :items="tours"/>
    </div>
  </body>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans+Caption:wght@400;700&display=swap');

.homePage__title {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
}

.homePage__title__text {
    font-family: "PT Sans Caption", serif;
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
}

.homePage__searchBar {
  display: flex;
  justify-content: center;
}

.search__block {
  display: flex;
  align-items: center;
  width: 298px;
  height: 48px;
  margin-right: 30px;
  padding-left: 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);;
}

.search__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  background-color: transparent;
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #999999;
}

.search__input:focus {
  outline: none;
}

.search__input::placeholder {
  color: #999999;
}

.filter__block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 298px;
  height: 48px;
  padding-left: 14px;
  padding-right: 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);;
}

.filter__text {
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #999999;
}

.filter__button {
  width: 20px;
  height: 20px;
}

.filter__dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: -1px;
  width: 298px;
  max-height: 239px;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
  overflow-y: auto;
  padding: 0;
}

.dropdown-scroll {
  height: 234px;
  overflow-y: auto;
}

.dropdown-scroll__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-scroll__item {
  display: flex;
  align-items: center;
  height: 47px;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);;
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #444;
}

.dropdown-scroll__item:last-child {
  border-bottom: none;
}

.dropdown-scroll__item:hover {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .homePage__title {
    margin-bottom: 25px;
  }

  .homePage__title__text {
    font-size: 36px;
  }

  .homePage__searchBar {
    flex-direction: column;
    gap: 15px;
    padding-left: 5%;
    padding-right: 5%;
  }

  .search__block {
    width: 100%;
  }

  .filter__block {
    width: 100%;
  }

  .filter__dropdown {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .homePage__title__text {
    font-size: 26px;
  }
}
</style>