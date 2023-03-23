Vue.config.delimiters = ['[[', ']]'];

const app = Vue.createApp({
  data() {
    return {
      cups: [
        { id: 1, name: 'Blue Jellyfish Cup', price: 25.99, image_url: '/static/img/blue_jellyfish_cup.jpg' },
        { id: 2, name: 'Green Jellyfish Cup', price: 25.99, image_url: '/static/img/green_jellyfish_cup.jpg' },
        { id: 3, name: 'Pink Jellyfish Cup', price: 25.99, image_url: '/static/img/pink_jellyfish_cup.jpg' },
        { id: 4, name: 'Purple Jellyfish Cup', price: 25.99, image_url: '/static/img/purple_jellyfish_cup.jpg' },
        { id: 5, name: 'Red Jellyfish Cup', price: 25.99, image_url: '/static/img/red_jellyfish_cup.jpg' },
        { id: 6, name: 'Yellow Jellyfish Cup', price: 25.99, image_url: '/static/img/yellow_jellyfish_cup.jpg' },
      ],
    };
  },
  methods: {
    addToCart(cup) {
      console.log('Adding cup to cart:', cup);
    },
  },
});

app.mount('#app');
