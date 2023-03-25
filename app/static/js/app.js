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

function createAestheticSelect(aesthetics) {
  const aestheticSelect = $("<select>")
    .addClass("form-select")
    .attr("aria-label", "Aesthetic");

  aesthetics.forEach((aesthetic) => {
    aestheticSelect.append(
      $("<option>")
        .val(aesthetic.id)
        .text(aesthetic.name + " ($" + aesthetic.price + ")")
    );
  });

  return aestheticSelect;
}

function createTextOptionSelect(textOptions) {
  const textOptionSelect = $("<select>")
    .addClass("form-select")
    .attr("aria-label", "Text Color");

  textOptions.forEach((textOption) => {
    textOptionSelect.append(
      $("<option>")
        .val(textOption.id)
        .text(textOption.color + " ($" + textOption.price + ")")
    );
  });

  return textOptionSelect;
}

function populateCups(cups, aesthetics, textOptions) {
  const cupContainer = $(".row-cols-md-3");

  cups.forEach((cup) => {
    const aestheticSelect = createAestheticSelect(aesthetics);
    const textOptionSelect = createTextOptionSelect(textOptions);
    const textInput = $("<input>")
      .attr("type", "text")
      .attr("placeholder", "Custom Text (Max 50 characters)")
      .attr("maxlength", "50")
      .addClass("form-control mb-2");

    const addToCartButton = $("<button>")
      .addClass("btn btn-primary")
      .text("Add to Cart")
      .on("click", function () {
        // Handle adding to cart
      });

    const cupElement = $("<div>")
      .addClass("col")
      .append(
        $("<div>")
          .addClass("card h-100 shadow-sm")
          .append(
            $("<img>")
              .attr("src", cup.image_url)
              .attr("alt", cup.name)
              .addClass("card-img-top"),
            $("<div>")
              .addClass("card-body")
              .append(
                $("<h5>").addClass("card-title").text(cup.name),
                $("<p>").addClass("card-text").text("$" + cup.price),
                aestheticSelect,
                textOptionSelect,
                textInput,
                addToCartButton
              )
          )
      );

    cupContainer.append(cupElement);
  });
}


function fetchAesthetics() {
  $.ajax({
    url: "/api/aesthetics",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (Array.isArray(data)) {
        populateAesthetics(data);
      } else {
        console.error("Aesthetics data is not an array:", data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching aesthetics:", error);
    },
  });
}

function fetchTextOptions() {
  $.ajax({
    url: "/api/text_options",
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (Array.isArray(data)) {
        populateTextOptions(data);
      } else {
        console.error("Text options data is not an array:", data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching text options:", error);
    },
  });
}

$(document).ready(function () {
  fetchCups();
  fetchAesthetics();
  fetchTextOptions();
});
