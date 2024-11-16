<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import CardList from '@/components/CardList.vue';

const cities = ref([]);
const tours = ref([]);
const showDropdown = ref(false);
const selectedTour = ref(null);
const selectedCityName = ref(null);
const selectedCityId = ref(null);
const filteredTours = ref([]);
const noFilterResults = ref(false)
const isLoading = ref(true);

//Получение экскурсий и городов
onMounted(async () => {
  try {
    isLoading.value = true;

    //В связи с тем, что CORS не давал получать данные с моего домена, решил использовать proxy
    const citiesData = await axios.get('https://thingproxy.freeboard.io/fetch/https://api.sputnik8.com/v1/cities', {
      params: {
        api_key: '873fa71c061b0c36d9ad7e47ec3635d9',
        username: 'frontend@sputnik8.com',
        // fields: 'name' / select: 'name' - Пытался сразу получить только названия городов, а не весь объект, но видимо ваш сервер не имеет такого функционала, поэтому придется обрабатывать объект уже на клиенте
      }
    });

    //Сортирую города, чтоб в начале списка были популярные города
    if (citiesData.data) {
      const targetCities = ['Москва', 'Санкт-Петербург', 'Казань', 'Сочи', 'Париж'];

      const filteredCities = citiesData.data.map(city => ({ name: city.name, id: city.id }));
      
      const matchingCities = filteredCities.filter(city => targetCities.includes(city.name));
      const otherCities = filteredCities.filter(city => !targetCities.includes(city.name));

      const sortedCities = [...matchingCities, ...otherCities];

      cities.value = sortedCities;
      
    } else {
      console.error("Ошибка получения данных от сервера");
    }

    //Экскурсии беру с первых 5 страниц (250 штук)
    let allToursData = [];
    for (let i = 1; i <= 5; i++) {
      const toursData = await axios.get('https://thingproxy.freeboard.io/fetch/https://api.sputnik8.com/v1/products', {
        params: {
          api_key: '873fa71c061b0c36d9ad7e47ec3635d9',
          username: 'frontend@sputnik8.com',
          page: i
        }
      });
      if (toursData.data.length > 0) {
        allToursData = allToursData.concat(toursData.data);
      } else {
        break;
      }
    }

    tours.value = allToursData.map(tour => ({ 
      main_photo: tour.main_photo, 
      title: tour.title,
      netto_price: tour.netto_price,
      city_id: tour.city_id,
      customers_review_rating: tour.customers_review_rating,
      reviews: tour.reviews
    }));

    isLoading.value = false;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    isLoading.value = false;
  }
});

//Фильтрация по названию и городу
const updateFilteredTours = () => {
      if (!selectedTour.value && !selectedCityId.value) {
        noFilterResults.value = false;
        return;
      }

      filteredTours.value = tours.value.filter(tour => {
        const cityMatch = !selectedCityId.value || tour.city_id === selectedCityId.value;
        const titleMatch = !selectedTour.value || tour.title.toLowerCase().includes(selectedTour.value.toLowerCase());
        return cityMatch && titleMatch;
      });

      noFilterResults.value = filteredTours.value.length === 0;
    };

watch([selectedTour, selectedCityId], updateFilteredTours);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCity = (city) => {
  selectedCityName.value = city.name; 
  selectedCityId.value = city.id;
  showDropdown.value = false;
};

const clearFilters = () => {
  selectedTour.value = null;
  selectedCityName.value = null;
  selectedCityId.value = null;
  filteredTours.value = [];
  noFilterResults.value = false;

  updateFilteredTours(); 
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
          <svg 
            v-if="selectedTour"
            @click="selectedTour = ''"
            class="search__input__clear" 
            width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.195262 0.195262C0.455612 -0.0650874 0.877722 -0.0650874 1.13807 0.195262L4.66667 3.72386L8.19527 0.195262C8.45562 -0.0650874 8.87773 -0.0650874 9.13808 0.195262C9.39843 0.455612 9.39843 0.877722 9.13808 1.13807L5.60948 4.66667L9.13807 8.19526C9.39842 8.45561 9.39842 8.87772 9.13807 9.13807C8.87772 9.39842 8.45561 9.39842 8.19526 9.13807L4.66667 5.60948L1.13808 9.13807C0.877726 9.39842 0.455616 9.39842 0.195266 9.13807C-0.0650833 8.87772 -0.0650833 8.45561 0.195266 8.19526L3.72386 4.66667L0.195262 1.13807C-0.0650874 0.877722 -0.0650874 0.455612 0.195262 0.195262Z" fill="#999999"/>
          </svg>
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
      <div class="homePage__Loading__Data" v-if="isLoading">
        <p>Загружаем товары с сервера...</p>
      </div>
      <div class="noFilterResults__block" v-if="noFilterResults">
        <span>Поиск не дал результатов</span>
        <button class="clearFilters__button" @click="clearFilters">Сбросить фильтры</button>
      </div>
      <CardList :items="filteredTours"/>
    </div>
  </body>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans+Caption:wght@400;700&display=swap');

.homePage__container {
  margin-bottom: 50px;
}

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
  margin-bottom: 90px;
}

.search__block {
  display: flex;
  align-items: center;
  width: 298px;
  height: 48px;
  margin-right: 30px;
  padding-left: 14px;
  padding-right: 14px;
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

.search__input__clear {
  transition: transform 0.1s ease-in-out;

  &:active {
      transform: scale(0.8);
  }
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

.homePage__Loading__Data {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.homePage__Loading__Data p {
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  color: #444;
}

.noFilterResults__block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.noFilterResults__block span {
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  color: black;
  margin-bottom: 30px;
}

.clearFilters__button {
  background-color: #00A7FF;
  border: none;
  color: white;
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  border-radius: 5px;
  width: 199px;
  height: 40px;
  transition: transform 0.1s ease-in-out;

  &:active {
      transform: scale(0.8);
  }
}

@media (max-width: 1155px) {
  .homePage__searchBar {
    margin-bottom: 50px;
  }
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

  .homePage__Loading__Data p {
    font-size: 22px;
  }
}
</style>