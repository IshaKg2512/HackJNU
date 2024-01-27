$(document).ready(function () {
    chrome.storage.sync.get(null, (items) => {
      var keys = Object.keys(items);
      if (keys.length != 4) {
        // Not setup
        $("input").each(function () {
          var field = $(this).attr("id");
          items[field] = true;
        });
      }
      for (item in items) {
        $(`input#${item}`).prop("checked", items[item]);
      }
    });
  });
  
  $("input").on("click", function () {
    var field = $(this).attr("id");
    var checked = $(this).prop("checked");
  
    chrome.storage.sync.set({ [field]: checked });
  });
  