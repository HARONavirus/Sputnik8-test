<script setup>

</script>

<template>
    <body class="homePage">
        <div class="homePage__container">
            <div class="homePage__title">
                <h1 class="homePage__title__text">Экскурсии по всему миру</h1>
            </div>
            <div class="homePage__searchBar">
              <div class="search__block">
                <span class="search__text">Введите название экскурсии</span>
              </div>
              <div class="filter__block">
                <span class="filter__text">Выбрать город</span>
                <div class="filter__button">
                  <svg class="filter__button__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.20711 7C4.76165 7 4.53857 7.53857 4.85355 7.85355L9.64645 12.6464C9.84171 12.8417 10.1583 12.8417 10.3536 12.6464L15.1464 7.85355C15.4614 7.53857 15.2383 7 14.7929 7H5.20711Z" fill="#DDDDDD"/>
                  </svg>
                </div>

              </div>
            </div>
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

.search__text {
  font-family: "PT Sans Caption", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #999999;
}

.filter__block {
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
}

@media (max-width: 480px) {
  .homePage__title__text {
    font-size: 26px;
  }
}
</style>