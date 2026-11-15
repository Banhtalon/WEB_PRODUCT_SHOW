// Đánh dấu mục đang xem trên thanh điều hướng khi cuộn trang
var nav = document.querySelector("nav");
var links = document.querySelectorAll("nav a");
var map = {};

for (var i = 0; i < links.length; i++) {
  var id = links[i].getAttribute("href").slice(1);
  map[id] = links[i];
}

var io = new IntersectionObserver(function (entries) {
  for (var j = 0; j < entries.length; j++) {
    if (entries[j].isIntersecting) {
      for (var k = 0; k < links.length; k++) {
        links[k].classList.remove("on");
      }
      var activeLink = map[entries[j].target.id];
      if (activeLink) {
        activeLink.classList.add("on");
        nav.scrollLeft = activeLink.offsetLeft - (nav.clientWidth - activeLink.offsetWidth) / 2;
      }
    }
  }
}, { rootMargin: "-40% 0px -55% 0px" });

for (var sectionId in map) {
  var sec = document.getElementById(sectionId);
  if (sec) {
    io.observe(sec);
  }
}

// Xử lý biểu mẫu đăng ký nhận thông tin
var form = document.getElementById("signup");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var ten = document.getElementById("f-name").value.trim();
  var email = document.getElementById("f-email").value.trim();
  var chuDe = document.getElementById("f-topic").value;
  var thongBao = document.getElementById("f-msg");

  var emailHopLe = email.indexOf("@") > 0 && email.indexOf(".") > email.indexOf("@") + 1;
  thongBao.hidden = false;

  if (!ten) {
    thongBao.className = "msg err";
    thongBao.textContent = "Vui lòng nhập họ và tên.";
    return;
  }
  if (!emailHopLe) {
    thongBao.className = "msg err";
    thongBao.textContent = "Email chưa đúng định dạng, ví dụ: ten@example.com.";
    return;
  }

  thongBao.className = "msg ok";
  thongBao.textContent = "Cảm ơn " + ten + "! Đã ghi nhận đăng ký chủ đề \"" + chuDe + "\" qua email " + email + ".";
  form.reset();
});
