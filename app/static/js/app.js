function fetchCups() {
  $.ajax({
    url: "/api/cups",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (Array.isArray(data)) {
        populateCups(data);
      } else {
        console.error("Cups data is not an array:", data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching cups:", error);
    },
  });
}

function populateCups(cups) {
  const row = $(".row-cols-1");
  row.empty();

  cups.forEach((cup) => {
    const col = $("<div>").addClass("col");
    const card = $("<div>").addClass("card h-100 shadow-sm");

    const img = $("<img>")
      .addClass("card-img-top")
      .attr("src", cup.image_url)
      .attr("alt", cup.name);
    const cardBody = $("<div>").addClass("card-body");
    const cardTitle = $("<h5>").addClass("card-title").text(cup.name);
    const cardText = $("<p>").addClass("card-text").text(`$${cup.price}`);

    const addToCartBtn = $("<button>")
      .addClass("btn btn-primary")
      .text("Add to Cart")
      .on("click", function () {
        addToCart(cup);
      });

    cardBody.append(cardTitle, cardText, addToCartBtn);
    card.append(img, cardBody);
    col.append(card);
    row.append(col);
  });
}

$(document).ready(function () {
  fetchCups();
});
