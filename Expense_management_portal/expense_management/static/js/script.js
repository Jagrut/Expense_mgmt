$(document).ready(function() {
    // Load datatable.
    table = $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/expense/?format=datatables",
        "columns": [
            {"data": "first_name", "name": "employee.first_name"},
            {"data": "last_name", "name": "employee.last_name"},
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
            wait_till_datatable_loads();
        }
    });
    
    var color_class_arr = ['red-row', 'orange-row', 'green-row', 'selected'];

    var URL = "http://localhost/api/v1/stat"
    makeAjaxCall(URL, "GET").then(function(respJson){
        console.log("stat request made ...");
        console.info(respJson);
        $('.stats b:first-child').eq(0).text(respJson.total_expenses);
        $('.stats b:first-child').eq(1).text(respJson.pending_expenses);
        $('.stats b:first-child').eq(2).text(respJson.accepted_expenses);
        $('.stats b:first-child').eq(3).text(respJson.declined_expenses);
    })
    // Sleep function.
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $('#example tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
 
    function makeAjaxCall(url, methodType, data=null){
        return $.ajax({
  	      url : url,
          method :  methodType,
          dataType : "json",
          data : JSON.stringify(data),
          contentType: 'application/json; charset=utf-8'
          })
    }

    var t = $('#example').DataTable();
    rows_len = 0;

    async function wait_till_datatable_loads(){
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
                td_change_class("orange-row", rows[i]);

            }
            else if (status == "Accepted"){
                $(rows[i]).addClass('green-row');
                td_change_class("green-row", rows[i]);
            }
            else if (status == "Declined"){
                $(rows[i]).addClass('red-row');
                td_change_class("red-row", rows[i]);
            }
        };
    }

    $('#example tbody').on( 'click', 'tr', function () {
        $('td', this).each(function(index){
            $(this).toggleClass('selected');
        });
    });

    function td_change_class(class_name, row){
        $('td', row).each(function(index){
            for(let i of color_class_arr){
                if (i != class_name){
                    $(this).removeClass(i);
                }
            }
            $(this).addClass(class_name);
        });
    }

    function add_class(class_name, class_to_be_added="selected"){
        var rows = t.rows(class_name).nodes();
        var rows_len = rows.length;
        for(let i=0; i<rows_len; i++) {
            $(rows[i]).addClass(class_to_be_added);
            $('td', rows[i]).each(function(index){
                $(this).addClass(class_to_be_added);
            });
        };
    }
    $('#sel-all-pendings').click( function () {
        add_class('.orange-row');
    });
    $('#sel-all-declined').click( function () {
        add_class('.red-row');
    });
    $('#sel-all-accepted').click( function () {
        add_class('.green-row');
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

    function get_stats_inx(status_str){
        var inx = 0;
        if (status_str == 'Accepted'){
            inx = 2;
        }
        else if (status_str == 'Declined'){
            inx = 3;
        }
        else if (status_str == 'Pending'){
            inx = 1;
        }
        return inx

    }

    function update_stats(cur_status_str, updated_str){
        var cur_inx = get_stats_inx(cur_status_str);
        var cur_val = $('.stats b:first-child').eq(cur_inx).text();
        $('.stats b:first-child').eq(cur_inx).text(Number(cur_val) - 1);
        var updated_inx = get_stats_inx(updated_str);
        var updated_val = $('.stats b:first-child').eq(updated_inx).text();
        $('.stats b:first-child').eq(updated_inx).text(Number(updated_val) + 1);
    }

    function update_table(id, class_name, status_str){
        var rows = t.rows('.selected').nodes();
        var rows_len = rows.length;
        console.log("rows_len " + rows_len);
        if (rows_len == 0){
            $("#temp-msg-info").removeClass("hidden");
            setTimeout(function() { $("#temp-msg-info").addClass("hidden"); }, 5000);
            return
        }
        var id_arr = [];
        for(let i=0; i<rows_len; i++) {
            id_arr.push(rows[i].id);
        };
        
        id_arr.push(id);
        var URL = "http://localhost/api/v1/expense"
        makeAjaxCall(URL, "PATCH", id_arr).then(function(respJson){
            for(let i=0; i<rows_len; i++) {
                $(rows[i]).click();
                cur_status_str = $(rows[i]).find('td:last').text();
                update_stats(cur_status_str, status_str);
                td_change_class(class_name, rows[i]);
                $(rows[i]).find('td:last').text(status_str);
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
        update_table("2", "green-row", "Accepted");
    });
    $('#decline').click( function () {
        update_table("3", "red-row", "Declined");
    });
    $('#pending').click( function () {
        update_table("1", "orange-row", "Pending");
    });
} );
