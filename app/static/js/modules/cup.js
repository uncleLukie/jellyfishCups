export {
    fetchCups, getCupById, openCustomizationModal,
    populateCups, fetchTextColors, fetchAesthetics, cups
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
    const availableAesthetics = aesthetics.filter(aesthetic => aesthetic.stock > 0);

    // Populate aesthetic options
    let aestheticOptions = "";
    availableAesthetics.forEach((aesthetic) => {
        aestheticOptions += `<option value="${aesthetic.id}" data-image="${aesthetic.image_url}" data-price="${aesthetic.price}">${aesthetic.name} (${aesthetic.price.toFixed(2)})</option>`;
    });
    $("#aesthetic-selector").html(aestheticOptions);

    // Filter text colors to only include those with stock greater than 0
    const availableTextColors = text_colors.filter(text_color => text_color.stock > 0);

    // Populate text color options
    let textColorOptions = "";
    availableTextColors.forEach((text_color) => {
        textColorOptions += `<option value="${text_color.id}" data-image="${text_color.image_url}" data-price="${text_color.price}">${text_color.color} (${text_color.price.toFixed(2)})</option>`;
    });
    $("#text-color-selector").html(textColorOptions);

    $("#customizationModal").modal("show");
}
