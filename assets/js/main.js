let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

// ----------------- ADD DRUG -----------------
$("#add_drug").submit(function(event){
    alert($("#name").val() + " sent successfully!");
})

// ----------------- UPDATE DRUG -----------------
$("#update_drug").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}
    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    var request = {
      "url" : `http://${url}/api/drugs/${data.id}`,
      "method" : "PUT",
      "data" : data
    }

    $.ajax(request)
      .done(function(response){
        window.location.href = "/manage";
      })
      .fail(function(xhr){
        let msg = (xhr.responseJSON && (xhr.responseJSON.error || xhr.responseJSON.message))
                  || xhr.responseText || "Update failed";
        alert(msg);
      });
})

// ----------------- DELETE DRUG -----------------
if(window.location.pathname == "/manage"){
    $ondelete = $("table tbody td a.delete");
    $ondelete.click(function(){
        let id = $(this).attr("data-id")

        let request = {
            "url" : `http://${url}/api/drugs/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){
            $.ajax(request)
              .done(function(response){
                location.reload();
              })
              .fail(function(xhr){
                let msg = (xhr.responseJSON && xhr.responseJSON.error) || xhr.responseText || "Delete failed";
                alert(msg);
              });
        }
    })
}

// ----------------- PURCHASE DRUGS -----------------
if(window.location.pathname == "/purchase"){
  $("#drug_days").submit(function(event){
    event.preventDefault();
    const days = +$("#days").val();
    if (!days || days <= 0) {
      return alert("Vui lòng nhập số ngày hợp lệ");
    }

    // Lặp từng dòng trong bảng
    $("#purchase_table tbody tr").each(function () {
      const drugId = $(this).find("td").eq(1).data("id"); // lấy drugId từ cột Name
      const packsToBuy = parseInt($(this).find("td").eq(3).text(), 10);

      if (!drugId || !packsToBuy) return;

      $.ajax({
        url: `http://${url}/api/drugs/purchase`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ drugId, quantity: packsToBuy })
      })
        .done(function(res){
          console.log("Purchased:", res);
        })
        .fail(function(xhr){
          let msg = (xhr.responseJSON && (xhr.responseJSON.error || xhr.responseJSON.message))
                    || xhr.responseText || "Purchase failed";
          alert(msg);
        });
    });

    alert("Mua thuốc thành công cho " + days + " ngày!");
    location.reload();
  });
}
