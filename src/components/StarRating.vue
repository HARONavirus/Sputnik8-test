<script setup>

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0
  }
});

function getStarClass(i) {
  const floorRating = Math.floor(props.rating);
  if (i <= floorRating) {
    return 'active';
  } else if (i === floorRating + 1 && props.rating !== floorRating && props.rating <= floorRating + 1) {
      return 'half-star';
  }
  return '';
}
</script>

<template>
    <div class="star__rating">
        <svg
          v-for="i in 5"
          :key="i"
          class="star"
          :class="getStarClass(i)"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <use xlink:href="#star" />
        </svg>
    </div>
    <div class="star_hidden">
        <svg style="width: 0; height: 0;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <defs>
            <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stop-color="#fed94b" />
                <stop offset="50%" stop-color="#f7f0c3" />
            </linearGradient>
            <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="star">
                <path
                d="M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z"
                />
            </symbol>
            </defs>
        </svg>
    </div>
</template>

<style scoped>
.star__rating {
  display: flex;
  gap: 2px;
}

.star {
  width: var(--size, 16px);
  height: var(--size, 16px);
  fill: lightgrey;
  stroke: grey;
}

.star.active {
  fill: #fed94b;
}

.star.half-star {
  fill: url(#half);
}
</style>