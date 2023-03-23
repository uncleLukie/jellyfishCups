const app = Vue.createApp({
  data() {
    return {
      cups: [],
    };
  },
  methods: {
    addToCart(cup) {
      console.log("Add to cart:", cup);
    },
  },
  mounted() {
    fetch("/api/cups")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Add this line
        this.cups = data;
      });
  },
}).mount("#app");
