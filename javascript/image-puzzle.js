var arr1 = [];
var gridSize = 3;
var done;
var i;
var size = 400;

if (localStorage.length == 0) {
    arr1 = [0, 1, 2, 3, 4];
    shuffle(arr1)
    done = 'false';
    i = 0;
    localStorage.setItem("array", JSON.stringify(arr1));
    localStorage.setItem("gridsize", gridSize);
    localStorage.setItem("i", i);
    localStorage.setItem("done", done);

  }else{
    var arr2 = JSON.parse("[" + localStorage.getItem("array") + "]");
    for(let i = 0; i < arr2[0].length;i++){
        arr1[i] = arr2[0][i];
    }
    gridSize = parseInt(localStorage.getItem("gridSiye"), 10);
    i = parseInt(localStorage.getItem("i"), 10);
    done = localStorage.getItem("done");
  }

$.getJSON("fotkyJson.json", function(myJson) {

    var images = [
        { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
        { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
        { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
        { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
        { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
    ];

        gridSize = $('#level :radio:checked').val();
        puzzle.init(images, gridSize,i);

        $('#level :radio').change(function (e) {
            gridSize = $('#level :radio:checked').val();
            puzzle.init(images, gridSize,i);
        });
});


var time;

var puzzle = {
    steps: 0,
    startTime: new Date().getTime(),
    init: function (images, gridSize, i) {
        if(done === 'true'){
            document.getElementById("btnDiv").style.display = "block";
            document.getElementById('doneDiv').style.display = "flex";
          }
        this.setImage(images, gridSize,i);
        $('#playPanel').show();
        $('#sortable').randomize();
        this.enableSwapping('#sortable li');
        this.steps = 0;
        $('.stepCount').text(puzzle.steps);
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - puzzle.startTime) / 1000, 10);
        $('#timerPanel').text(elapsedTime);  
        time = setTimeout(puzzle.tick, 1000);
    },
    enableSwapping: function (elem) {
        $(elem).draggable({
            snap: '#droppable',
            snapMode: 'outer',
            revert: "invalid",
            helper: "clone"
        });
        $(elem).droppable({
            drop: function (event, ui) {
                var $dragElem = $(ui.draggable).clone().replaceAll(this);
                $(this).replaceAll(ui.draggable);

                currentList = $('#sortable > li').map(function (i, el) { return $(el).attr('data-value'); });
                if (isSorted(currentList)){
                    const children = document.getElementById('progressbar').children;
                    openModal();
                    if(done === 'true'){
                        for(let j = 0; j < arr1.length; j++){
                            children.item(j).setAttribute('class','active');
                            document.getElementById('doneDiv').style.display = "flex";
                        }
                    }else{
                        for(let j = 0; j <= i; j++){
                            children.item(j).setAttribute('class','active');
                        }
                    }
                }
                else {
                    var now = new Date().getTime();
                    puzzle.steps++;
                    $('.stepCount').text(puzzle.steps);
                    $('.timeCount').text(parseInt((now - puzzle.startTime) / 1000, 10));
                }

                puzzle.enableSwapping(this);
                puzzle.enableSwapping($dragElem);
            }
        });
    },

    setImage: function (images, gridSize,i) {
        localStorage.setItem("gridsize", gridSize);
        gridSize = gridSize;
        var percentage = 100 / (gridSize - 1);
        
        var image = images[i];
        $('#imgTitle').html(image.title);
        $('#actualImage').attr('src', image.src);
        $('#sortable').empty();
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';
            var li = $('<li class="item" data-value="' + (i) + '"></li>').css({
                'background-image': 'url(' + image.src + ')',
                'background-size': (gridSize * 100) + '%',
                'background-position': xpos + ' ' + ypos,
                'width': size / (gridSize),
                'height': size / (gridSize)
            });
            $('#sortable').append(li);
        }
        $('#sortable').randomize();
    }
};

function isSorted(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] != i)
            return false;
    }
    return true;
}
$.fn.randomize = function (selector) {
    var $elems = selector ? $(this).find(selector) : $(this).children(),
        $parents = $elems.parent();

    $parents.each(function () {
        $(this).children(selector).sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).remove().appendTo(this);
    });
    return this;
};

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function nextImg(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    $.getJSON("fotkyJson.json", function(myJson) {

        var images = [
            { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
            { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
            { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
            { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
            { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
        ];

        i = ++i;
        localStorage.setItem("i", i);
        if(parseInt(i)==5){
            done='true';
            localStorage.setItem("done", done);
            i=0;
            localStorage.setItem("i", i);
            document.getElementById("btnDiv").style.display = "block";
        }
        puzzle.init(images, gridSize,i);
    });
  }

  function prevImg(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    $.getJSON("fotkyJson.json", function(myJson) {

        var images = [
            { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
            { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
            { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
            { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
            { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
        ];

            i = --i;
            localStorage.setItem("i", i);
            if(parseInt(i)<0){
                i=4;
                localStorage.setItem("i", i);
            }
            puzzle.init(images, gridSize,i);
    });
  }

function openModal(){
    var modal = document.getElementById("myModal");

    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";
  
    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
};

function myFunction(x) {
    if (x.matches) {
      size = 320;
      $.getJSON("fotkyJson.json", function(myJson) {

        var images = [
            { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
            { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
            { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
            { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
            { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
        ];
            puzzle.init(images, gridSize,i);
    });
    } else {
        size = 400;
      $.getJSON("fotkyJson.json", function(myJson) {

        var images = [
            { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
            { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
            { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
            { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
            { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
        ];
            puzzle.init(images, gridSize,i);
    });
    }
  }
  
  var x = window.matchMedia("(max-width: 801px)")
  myFunction(x)
  x.addListener(myFunction)