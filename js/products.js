var product_filter = {
  type: "",
  price: [0, 200],
  brand: [],
};
var temp_num = 1;

var shoppingCar = [];

var setStorage = function () {
  window.localStorage.setItem("shoppingCar", JSON.stringify(shoppingCar));
};

var getStorage = function () {
  var shoppingCarStr = window.localStorage.getItem("shoppingCar");
  if (shoppingCarStr != null) {
    shoppingCar = JSON.parse(shoppingCarStr);
  }
};

var getItemInfo = function (id) {
  for (key in products) {
    if (!product_filter.type || product_filter.type == key) {
      for (item of products[key]) {
        if (item.id.toString() == id) {
          return item;
        }
      }
    }
  }
  return null;
};

var filtering = function () {
  var productsDom = $(".product-item");
  for (itemDom of productsDom) {
    var show = false;
    var itemInfo = getItemInfo(itemDom.dataset.id);
    if (itemInfo != null) {
      show =
        product_filter.brand.length == 0 ||
        product_filter.brand.includes(itemInfo.Brand);
      show = show
        ? product_filter.price[0] <= itemInfo.price &&
          product_filter.price[1] >= itemInfo.price
        : show;
    }
    show ? $(itemDom).show() : $(itemDom).hide();
  }
};

var generateProducts = function () {
  var productWrapper = $("#product-right");
  for (type in products) {
    for (item of products[type]) {
      var btn_text = "ADD";
      var btn_class = "";
      if (shoppingCar.includes(item.id.toString())) {
        btn_text = "REMOVE";
        btn_class = "item-in-shoppingcar";
      }
      var html = `<div class="product-item"  data-id="${item.id}" >
      <p class="product-item-imgWrapper">
        <img class="product-img" src="./images/${type}/${item.id}.jpg" alt="${item.name}" />
      </p>
      <p class="item-p-wrapper">
        <span class="item-ranking ranking-${item.ranking}"></span>

        <span class="item-comments-count"> ${item.comments}</span>
      </p>
      <p class="item-p-wrapper">
        <span class="item-name">${item.name}</span>
      </p>
      <p class="item-p-wrapper"><span class="item-price">$${item.price}</span></p>
      <p class="item-p-wrapper">
        Get it
        <span class="item-delivery">${item.GET}</span>
      </p>
      <p class="item-p-wrapper">
        <button class="item-btn-action ${btn_class}" data-id="${item.id}">
          <span class="item-btn-icon"></span>
          ${btn_text}
        </button>
      </p>
    </div>`;
      productWrapper.append(html);
    }
  }
  $(".item-btn-action").click(function () {
    var itemid = this.dataset.id;
    var btntext = "";
    if (shoppingCar.includes(itemid)) {
      //remove
      shoppingCar = shoppingCar.filter((value) => {
        return value != itemid;
      });
      btntext = "ADD";
    } else {
      //add
      shoppingCar.push(itemid);
      btntext = "REMOVE";
    }
    $(this)
      .toggleClass("item-in-shoppingcar")
      .html(`<span class="item-btn-icon"></span>${btntext}`);
    setStorage();
  });
};

$(document).ready(function () {
  $("#productType").selectmenu({
    change: function (event, ui) {
      product_filter.type = ui.item.value;
      filtering();
    },
  });

  $("#product-price-slider-range").slider({
    range: true,
    min: 0,
    max: 200,
    values: [0, 200],
    slide: function (event, ui) {
      $("#price-range").html("$" + ui.values[0] + " - $" + ui.values[1]);
      product_filter.price = [ui.values[0], ui.values[1]];
      temp_num += 1;
      if (temp_num > 100000) {
        temp_num = 0;
      }
      setTimeout(
        ((num) => {
          return () => {
            if (num == temp_num) {
              filtering();
            }
          };
        })(temp_num),
        500
      );
    },
  });

  $("input[name='Brand']").change(function () {
    if (this.checked) {
      product_filter.brand.push(this.value);
    } else {
      product_filter.brand = product_filter.brand.filter((value) => {
        return value != this.value;
      });
    }
    filtering();
  });
  getStorage();
  generateProducts();
});
