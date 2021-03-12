jQuery.validator.addMethod(
  "phone",
  function (value, element) {
    return this.optional(element) || /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(value);
  },
  "Please specify the correct phone number xxx-xxx-xxxx"
);

$(document).ready(function () {
  $("#checkoutform").validate({
    rules: {
      firstname: {
        required: true,
        normalizer: function (value) {
          return $.trim(value);
        },
      },
      lastname: {
        required: true,
        normalizer: function (value) {
          return $.trim(value);
        },
      },
      email: {
        required: true,
        email: true,
        normalizer: function (value) {
          return $.trim(value);
        },
      },
      Phone: {
        required: true,
        phone: true,
      },
      Address: {
        required: true,
      },
    },
    messages: {
      firstname: "Please specify your firstname",
      lastname: "Please specify your lastname",
      Phone: {
        required: "Please specify your Phone",
      },
      Address: "Please specify your Address",
      email: {
        required: "We need your email address to contact you",
        email: "Your email address must be in the format of name@domain.com",
      },
    },
    submitHandler: function () {
      var firstname = document.getElementById("firstname").value;
      var lastname = document.getElementById("lastname").value;
      $("#checkoutform").hide();
      $("#client-name").text(firstname + " " + lastname);
      $("#thanks").show();
    },
  });
  getStorage();
  productslist();
});

var shoppingCar = [];

var getStorage = function () {
  try {
    var shoppingCarStr = window.localStorage.getItem("shoppingCar");
    if (shoppingCarStr != null) {
      shoppingCar = JSON.parse(shoppingCarStr);
    }
  } catch {}
};

var getItems = function () {
  var items = [];
  for (type in products) {
    for (item of products[type]) {
      if (shoppingCar.includes(item.id.toString())) {
        item.type = type;
        items.push(item);
      }
    }
  }
  return items;
};

var productslist = function () {
  var listJQDOM = $("#item-list");
  var total_price = 0;
  if (shoppingCar.length == 0) {
    shoppingCar = ["1", "2", "3"];
  }
  var items = getItems();
  for (item of items) {
    total_price += item.price;
    var html = `<li>
    <img src="./images/${item.type}/${item.id}.jpg" alt="${item.name}" />
    <span>${item.name}</span>
    <span class="item-price">${item.price}</span>
  </li>`;
    listJQDOM.append(html);
  }
  total_price = total_price.toFixed(2);
  listJQDOM.append(
    `<li><span class="item-price">Total : $${total_price}</span></li>`
  );
};
