export {
    fetchCups, getCupById, openCustomizationModal,
    populateCups, fetchTextColors, fetchAesthetics, cups, saveCustomization
};

let cups = [];

function createCupCard(cup) {
    return `
    <div class="col">
      <div class="card h-100">
        <img src="${cup.image_url}" class="card-img-top" alt="${cup.name}">
        <div class="card-body">
          <h5 class="card-title">${cup.name}</h5>
          <p class="card-text">$${cup.price.toFixed(2)}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary add-to-cart" data-cup-id="${cup.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function populateCups(cups) {
    for (let i = 0; i < cups.length; i++) {
        let cup = cups[i];
        if (cup.stock > 0) {
            let cupCard = createCupCard(cup);
            $("#cups-container").append(cupCard);
        }
    }
}

function fetchCups() {
    return $.get("/api/cups", function (data) {
        localStorage.setItem("cups", JSON.stringify(data.cups));
        populateCups(data.cups);
    });
}

function getCupById(cupId) {
    let cups = JSON.parse(localStorage.getItem("cups")) || [];
    let cup = cups.find(cup => cup.id === cupId);
    return cup ? {...cup, name: cup.name || ''} : null;
}

function fetchAesthetics() {
    return $.get("/api/aesthetics", function (data) {
        return data.aesthetics;
    });
}

function fetchTextColors() {
    return $.get("/api/text_colors", function (data) {
        return data.text_colors;
    });
}

function openCustomizationModal(aesthetics, text_colors) {
    // Filter aesthetics to only include those with stock greater than 0
    const availableAesthetics = aesthetics.filter((aesthetic) => {
        return aesthetic.stock > 0;
    });

    // Add None option to aesthetics
    availableAesthetics.unshift({
        id: null,
        name: "None",
        image_url: null,
        price: 0,
    });

    // Populate aesthetic options
    let aestheticOptions = "";
    availableAesthetics.forEach((aesthetic) => {
        aestheticOptions += `<option value="${aesthetic.id}" data-image="${aesthetic.image_url}" data-price="${aesthetic.price}">${aesthetic.name} (${aesthetic.price.toFixed(2)})</option>`;
    });
    $("#aesthetic-selector").html(aestheticOptions);

    $("#aesthetic-selector").on("change", function () {
        let selectedAesthetic = $(this).find("option:selected");
        let imageUrl = selectedAesthetic.data("image");
        if (imageUrl) {
            $("#aesthetic-preview").attr("src", imageUrl).show();
        } else {
            $("#aesthetic-preview").hide();
        }
    });

    // Filter text colors to only include those with stock greater than 0
    const availableTextColors = text_colors.filter((text_color) => {
        return text_color.stock > 0;
    });

    // Add None option to text colors
    availableTextColors.unshift({
        id: null,
        color: "None",
        image_url: null,
        price: 0,
    });

    // Populate text color options
    let textColorOptions = "";
    availableTextColors.forEach((text_color) => {
        textColorOptions += `<option value="${text_color.id}" data-image="${text_color.image_url}" data-price="${text_color.price}">${text_color.color} (${text_color.price.toFixed(2)})</option>`;
    });
    $("#text-color-selector").html(textColorOptions);

    // Show/hide text content input field based on selected text color
    let $textColorSelector = $("#text-color-selector");
    let $textContentWrapper = $("#text-content-wrapper");
    let $textContent = $("#text-content");

    $("#text-color-selector").on("change", function () {
        let selectedTextColor = $(this).find("option:selected");
        let imageUrl = selectedTextColor.data("image");
        if (imageUrl) {
            $("#text-color-preview").attr("src", imageUrl).show();
        } else {
            $("#text-color-preview").hide();
        }

        // Compare the value of the selected option with null
        if (selectedTextColor.val() === null || isNaN(parseInt(selectedTextColor.val()))) {
            $textContentWrapper.hide();
        } else {
            $textContentWrapper.show();
        }
    });

    // Hide text content input field by default
    $textContentWrapper.hide();

    $("#customizationModal").modal("show");
}

function saveCustomization(selectedCup, selectedAesthetic, selectedTextColor, textContent) {
    let aestheticPrice = parseFloat(selectedAesthetic.text().match(/\(([^)]+)\)/)[1]);
    let textColorPrice = parseFloat(selectedTextColor.text().match(/\(([^)]+)\)/)[1]);
    let totalPrice = selectedCup.price + aestheticPrice + textColorPrice;

    selectedCup.aesthetic_id = parseInt(selectedAesthetic.val());
    selectedCup.aesthetic = {
        name: selectedAesthetic.text(),
        image_url: selectedAesthetic.data("image"),
        price: aestheticPrice
    };
    selectedCup.text_color_id = parseInt(selectedTextColor.val());
    selectedCup.text_color = {
        name: selectedTextColor.text(),
        image_url: selectedTextColor.data("image"),
        price: textColorPrice
    };
    selectedCup.text_content = textContent;
    selectedCup.total_price = totalPrice;

    return selectedCup;
}




