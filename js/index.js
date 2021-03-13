$(document).ready(function () {
  $("img").click(function () {
    window.location.href = "./products.html";
  });

  $("#arrow-left,#arrow-right").click(function () {
    var action = this.dataset.action;
    var wrapper = $("#img-wrapper");
    var position = action == "left" ? "-=150" : "+=150";
    wrapper.animate(
      {
        scrollLeft: position,
      },
      300,
      function () {}
    );
  });
});
