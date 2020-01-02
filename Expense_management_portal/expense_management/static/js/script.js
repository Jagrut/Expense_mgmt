$(document).ready(function() {
    // Load datatable.
    table = $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/expense/?format=datatables",
        "columns": [
            {"data": "first_name"},
            {"data": "last_name"},
            {"data": "description"},
            {"data": "amount"},
            {"data": "currency"},
            {"data": "created_at"},
            {"data": "status", "name": "status.status"},
        ],
        "order": [[ 5, "desc" ]],
        "responsive": true,
        "rowReorder": {
            "selector": 'td:nth-child(2)'
        },
        "drawCallback": function() {
            datatable_loaded();
        }
    });
    
    var color_class_arr = ['red-row', 'orange-row', 'green-row', 'selected'];

    // Sleep function.
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $('#example tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
 
    function makeAjaxCall(url, methodType, data){
        return $.ajax({
  	      url : url,
          method :  methodType,
          dataType : "json",
          data : JSON.stringify(data),
          contentType: 'application/json; charset=utf-8'
          })
    }
    var endpoint = "api/v1/expense";

    var t = $('#example').DataTable();
    rows_len = 0;
    js_obj = JSON.parse(data);

    // Fill stats.
    $('.stats b:first-child').eq(0).text(js_obj.total_expenses);
    $('.stats b:first-child').eq(1).text(js_obj.pending_expenses);
    $('.stats b:first-child').eq(2).text(js_obj.accepted_expenses);
    $('.stats b:first-child').eq(3).text(js_obj.declined_expenses);

    async function datatable_loaded(){
        while (true){
            t = $('#example').DataTable();
            var temp = t.rows().nodes().length
            if (temp == rows_len && temp != 0){
                change_table_color(t, temp);
                break;
            }
            rows_len = temp;
            await sleep(200);
        }
    }

    function change_table_color(table, rows_len){
        var rows = table.rows().nodes();
        for(let i=0; i<rows_len; i++) {
            var status = $(rows[i]).find('td:last').text();
            if (status == "Pending"){
                $(rows[i]).addClass('orange-row');
                td_add_class("orange-row", rows[i]);

            }
            else if (status == "Accepted"){
                $(rows[i]).addClass('green-row');
                td_add_class("green-row", rows[i]);
            }
            else if (status == "Declined"){
                $(rows[i]).addClass('red-row');
                td_add_class("red-row", rows[i]);
            }
        };
    }

    $('#example tbody').on( 'click', 'tr', function () {
        $('td', this).each(function(index){
            $(this).toggleClass('selected');
        });
    });

    function td_add_class(class_name, row){
        $('td', row).each(function(index){
            for(let i of color_class_arr){
                if (i != class_name){
                    $(this).removeClass(i);
                }
            }
            $(this).addClass(class_name);
        });
    }

    function change_class(class_name){
        var rows = t.rows(class_name).nodes();
        var rows_len = rows.length;
        for(let i=0; i<rows_len; i++) {
            $(rows[i]).addClass('selected');
            $('td', rows[i]).each(function(index){
                $(this).addClass('selected');
            });
        };
    }
    $('#sel-all-pendings').click( function () {
        change_class('.orange-row');
    });
    $('#sel-all-declined').click( function () {
        change_class('.red-row');
    });
    $('#sel-all-accepted').click( function () {
        change_class('.green-row');
    });

    $('#desel-all').click( function () {
        var rows = t.rows('.selected').nodes();
        var rows_len = rows.length;
        for(let i=0; i<rows_len; i++) {
            $(rows[i]).removeClass('selected')
            $('td', rows[i]).each(function(index){
                $(this).removeClass('selected');
            });
        };
    });

    function change_table_status(id, class_name){
        var rows = t.rows('.selected').nodes();
        var rows_len = rows.length;
        var id_arr = [];
        for(let i=0; i<rows_len; i++) {
            id_arr.push(rows[i].id);
        };
        
        id_arr.push(id);
        var URL = "http://localhost:8000/api/v1/expense"
        makeAjaxCall(URL, "PATCH", id_arr).then(function(respJson){
            for(let i=0; i<rows_len; i++) {
                $(rows[i]).click();
                td_add_class(class_name, rows[i]);
            };
            $("#temp-msg-success").removeClass("hidden");
            setTimeout(function() { $("#temp-msg-success").addClass("hidden"); }, 5000);
            console.info("request Processed successfully");
        }, function(reason){
            $("#temp-msg-danger").removeClass("hidden");
            setTimeout(function() { $("#temp-msg-danger").addClass("hidden"); }, 5000);
            console.error("error in processing your request", reason);
        })
    }

    $('#accept').click( function () {
        change_table_status("2", "green-row");
    });
    $('#decline').click( function () {
        change_table_status("3", "red-row");
    });
    $('#pending').click( function () {
        change_table_status("1", "orange-row");
    });
} );