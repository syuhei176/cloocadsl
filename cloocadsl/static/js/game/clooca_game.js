function load_mycharacters(success_cb, error_cb) {
    $.ajax({
        type: "GET",
        url: "/mycharacters",
        data: {},
        dataType: 'json',
        success: function(data, dataType) { /** Ajax通信が成功した場合に呼び出される */
        	success_cb(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  /** Ajax通信が失敗した場合に呼び出される */
                this; // thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
                error_cb(errorThrown);
//                alert('Error : ' + errorThrown);
        }
    });
}

function load_characters(success_cb, error_cb) {
    $.ajax({
        type: "GET",
        url: "/characters",
        data: {},
        dataType: 'json',
        success: function(data, dataType) { /** Ajax通信が成功した場合に呼び出される */
        	success_cb(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  /** Ajax通信が失敗した場合に呼び出される */
                this; // thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
                error_cb(errorThrown);
//                alert('Error : ' + errorThrown);
        }
    });
}

function load_myresults(success_cb, error_cb) {
    $.ajax({
        type: "GET",
        url: "/myresults",
        data: {},
        dataType: 'json',
        success: function(data, dataType) { /** Ajax通信が成功した場合に呼び出される */
        	success_cb(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  /** Ajax通信が失敗した場合に呼び出される */
                this; // thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
                error_cb(errorThrown);
//                alert('Error : ' + errorThrown);
        }
    });
}

function gen_chara(id, success_cb, error_cb) {
    $.ajax({
        type: "POST",
        url: "/gen-chara",
        data: {id : id},
        dataType: 'json',
        success: function(data, dataType) { /** Ajax通信が成功した場合に呼び出される */
        	success_cb(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  /** Ajax通信が失敗した場合に呼び出される */
                this; // thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
                error_cb(errorThrown);
//                alert('Error : ' + errorThrown);
        }
    });
}

function battle_result(game_type, counter, result, success_cb, error_cb) {
    $.ajax({
        type: "POST",
        url: "/insert-result",
        data: {game_type : game_type, counter : counter, result : result},
        dataType: 'json',
        success: function(data, dataType) { /** Ajax通信が成功した場合に呼び出される */
        	success_cb(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  /** Ajax通信が失敗した場合に呼び出される */
                this; // thisは他のコールバック関数同様にAJAX通信時のオプションを示します。
                error_cb(errorThrown);
//                alert('Error : ' + errorThrown);
        }
    });
}
