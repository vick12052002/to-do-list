// /清空表單的資料
function reset() {
    $("#title").val("");
    $("input[type='date']").val("");
    $("input[type='file']").val("");
    $("textarea").val("");
    $(".add-task-form").toggle();
};
if (localStorage.getItem("all") === null) {
    var toDoList = [];
    localStorage.setItem("all", JSON.stringify(toDoList))
}
else {
    var toDoList = JSON.parse(localStorage.getItem("all"));
};
function getlist() {
    let arrayJson = JSON.parse(localStorage.getItem("all"));
    if (arrayJson.length !== 0) {
        for (var i = 0; i < arrayJson.length; i++) {
            getData = arrayJson[i];
            $(".to-do-list-item").append(`<li class="to-do-item" data-id="${getData['id']}" >
                    <div class="add-task-title row ">
                    <div class="add-task-title-input col-10">
                        <input type="checkbox" name="checkbox" class="css-checkbox" id="${getData['id']}"/>
                        <label for="${getData['id']}" class="css-label"><input type="text" name="${getData['title']}" value="${getData['title']}" class="title-bg"></label>
                    </div>
                    <div class="add-task-title-icon col-2">
                        <label class="far fa-star icon-star icon" style="padding-right: 10px"></label>
                        <label class="fas fa-pen icon-pen icon"></label>
                    </div>
                    <div class="icon-list col" id="${getData['icon']}" >
                    </div>
                </div></li>`);
            if(getData.status == "done"){
                $(".css-checkbox").prop('checked', true);
                $(".add-task-title-input").find(".title-bg").toggleClass("done")

            }
            if (getData['date'] !== "") {
                $("#" + getData['icon']).append(
                    `<i class="far fa-calendar-alt">
                            <span>${getData['date']}</span>
                        </i>`)
            };
            if (getData['file'] > 0) {
                $("#" + getData['icon']).append(
                    ` <i class="far fa-file"></i>`
                )
            };
            if (getData['comment'] !== "") {
                $("#" + getData['icon']).append(
                    `<i class="far fa-comment-dots">
                        </i>`)
            };
        };
    }
}
function editItem(myId, item) {
    let arrayJson = JSON.parse(localStorage.getItem("all"));
    let myIcon = arrayJson[myId].icon;
    if (item.hasClass("editing") !== true) {
        $(item).addClass("editing").append(
            `<div class="add-task-item flex-column ">
                <div class="add-task-item-time ">
                    <label for="Deadline subtitle ">
                        <i class="far fa-calendar-alt "></i>
                        <b>Deadline</b>
                    </label>
                    <br>
                    <input type="date" name="date" class="deadline" value="${arrayJson[myId].date}">
                </div>
                <div class="add-task-item-file">
                    <label for="add-file subtitle">
                        <i class="far fa-file"></i>
                        <b>File</b>
                    </label>
                    <br>
                    <span class="add-file">
                        <input type="file" name="file" class="file" style="opacity :0.7;">
                        <span class="file-span">選擇檔案</span>
                    </span>
                </div>
                <div class="add-task-item-comment">
                    <label for="add-comment subtitle ">
                        <i class="far fa-comment-dots"></i>
                        <b>Comment</b>
                    </label>
                    <br>
                    <textarea name="comment" class="form-control" cols="20" rows="3">${arrayJson[myId].comment}</textarea>
                </div>
            </div>
            <div class="add-task-save row">
                <button class="cancel col-6 btn btn-light text-danger">NO &nbsp;Cancel</button>
                <button  class="save col-6 btn btn-primary">+ &nbsp;Save</button>
            </div>`);
    }
    else {
        $(item).children(".add-task-item , .add-task-save").toggle();
    };
    $(document).on("click", ".cancel", function () {
        var item = $(this).parents(".to-do-item");
        $(item).find(".add-task-item, .add-task-save").hide()
        $(item).find(".icon-list").show();
        $(item).children(".add-task-title").removeClass("title-border");
        $(item).find(".icon-pen").removeClass("text-primary");
    });
    $(document).on("click", ".save", function () {
        var item = $(this).parents(".to-do-item");
        var updateObj = {
            title: $(item).find("input[type='text']").val(),
            date: $(item).find("input[type='date']").val(),
            file: $(item).find("input[type='file']").get(0).files.length,
            comment: $(item).find("textarea").val(),
            id: myId,
            icon: myIcon,
        };

        let newArray = [];
        newArray.push(updateObj);
        var updateArray = arrayJson.map(obj => newArray.find(x => x.icon === obj.icon) || obj);
        stringJson = JSON.stringify(updateArray);
        localStorage.setItem('all', stringJson);
        $(item).find(".add-task-item, .add-task-save").hide()
        $(item).find(".icon-list").show();
        $(item).children(".add-task-title").removeClass("title-border");
        $(item).find(".icon-pen").removeClass("text-primary");
    })
};
$(window).on("hashchange", function () {
    summer();
})

function summer() {
    let hash = window.location.hash;
    let arrayJson = JSON.parse(localStorage.getItem("all"));
    if (hash == "#progress") {
        arrayJson
    }
    else if (hash == "#completed") {
        alert("complete")
    }
    else { alert("all"); }

};

function statusItem() {
    let arrayJson = JSON.parse(localStorage.getItem("all"))
    $("li").each(function () {
        if ($(this).find(".title-bg").hasClass("done")) {
            arrayJson.forEach((x) => {
                if (x.id == $(this).attr("data-id")) {
                    x.status = "done"
                }
            })
        }
        else{
            arrayJson.forEach((x) => {
                if (x.id == $(this).attr("data-id")) {
                    x.status = ""
                }
            })
        }
    })
    console.log(arrayJson)
    stringJson = JSON.stringify(arrayJson);
    localStorage.setItem("all", stringJson)
};
$(document).ready(function () {
    $("button").click((e) => { e.preventDefault() });
    getlist();
    $(".add-task-head").click(function () {
        $(".add-task-form").toggle()
    });
    $(document).on("click", ".css-checkbox", function () {
        $(this).parents(".add-task-title")
            .find(".title-bg").toggleClass("done");;
        statusItem();
    });
    $(document).on("click", "#save-task", function () {
        var title = $("input[type='text']").val();
        var date = $("input[type='date']").val();
        var file = $("input[type='file']").get(0).files.length;
        var comment = $("textarea").val();
        var dataObj = {
            title: title,
            date: date,
            file: file,
            comment: comment,
            status: "",
        };
        var id = toDoList.length;
        dataObj["id"] = toDoList.length;
        var icon = "icon" + id;
        dataObj["icon"] = "icon" + id;
        toDoList.push(dataObj);
        stringJson = JSON.stringify(toDoList);
        localStorage.setItem('all', stringJson);

        if (title.length == 0) {
            alert("type something")
        }
        else {
            $(".to-do-list-item").append(
                `<li class="to-do-item" data-id="${id}" >
                    <div class="add-task-title row ">
                    <div class="add-task-title-input col-10">
                        <input type="checkbox" name="checkbox" class="css-checkbox" id="${id}"/>
                        <label for="${id}" class="css-label"><input type="text" name="${title}" value="${title}" class="title-bg"></label>
                    </div>
                    <div class="add-task-title-icon col-2">
                        <label class="far fa-star icon-star icon" style="padding-right: 10px"></label>
                        <label class="fas fa-pen icon-pen icon"></label>
                    </div>
                    <div class="icon-list col " id="${icon}" >
                    </div>
                </div></li>`
            );
            if (date !== "") {
                $("#" + icon).append(
                    `<i class="far fa-calendar-alt">
                            <span>${date}</span>
                        </i>`)
            };
            if (file > 0) {
                $("#" + icon).append(
                    ` <i class="far fa-file"></i>`
                )
            };
            if (comment !== "") {
                $("#" + icon).append(
                    `<i class="far fa-comment-dots">
                        </i>`)
            };
            reset();
        }
    });
    $("#cancel-task").click(() => {
        $(".add-task-form").hide("slow");
    })
    $(document).on("click", ".icon-pen", function () {
        var item = $(this).parents(".to-do-item");
        var myId = $(this).parents(".add-task-title").find(".css-checkbox").attr("id");
        editItem(myId, item);
        $(item).children(".add-task-title").toggleClass("title-border").children(".icon-list").toggle();
        $(this).toggleClass("text-primary");
        $(this).parents(".add-task-form").children(".add-task-item ,.add-task-save").toggle();
    })
    $(document).on("click", ".icon-star", function () {
        $(this).toggleClass("far").toggleClass("fas").toggleClass("text-warning");
        $(this).parents(".add-task-title").toggleClass("star-bg");

        $(this).parents(".add-task-title-icon").siblings(".add-task-title-input").children(".css-label").children(".title-bg").toggleClass("star-bg");

    })

});

