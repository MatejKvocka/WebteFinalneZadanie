var arr1 = [0, 1, 2, 3, 4];
shuffle(arr1)
var i = 0;
var gridSize;
var done = false;
$.getJSON("fotkyJson.json", function(myJson) {

    var images = [
        { src: myJson[arr1[0]].filePath, title: myJson[arr1[0]].nameOfPicture },
        { src: myJson[arr1[1]].filePath, title: myJson[arr1[1]].nameOfPicture },
        { src: myJson[arr1[2]].filePath, title: myJson[arr1[2]].nameOfPicture },
        { src: myJson[arr1[3]].filePath, title: myJson[arr1[3]].nameOfPicture },
        { src: myJson[arr1[4]].filePath, title: myJson[arr1[4]].nameOfPicture },
    ];

        gridSize = $('#levelPanel :radio:checked').val();   
        imagePuzzle.startGame(images, gridSize,i);

        $('#levelPanel :radio').change(function (e) {
            var gridSize = $('#levelPanel :radio:checked').val();
            imagePuzzle.startGame(images, gridSize,i);
        });
});


var timerFunction;

var imagePuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),
    startGame: function (images, gridSize, i) {
        this.setImage(images, gridSize,i);
        $('#playPanel').show();
        $('#sortable').randomize();
        this.enableSwapping('#sortable li');
        this.stepCount = 0;
        $('.stepCount').text(imagePuzzle.stepCount);
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        $('#timerPanel').text(elapsedTime);  
        timerFunction = setTimeout(imagePuzzle.tick, 1000);
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
                    children.item(i).setAttribute('class','active');
                    if(done == false){
                        openModal();
                    }
                }
                else {
                    var now = new Date().getTime();
                    imagePuzzle.stepCount++;
                    $('.stepCount').text(imagePuzzle.stepCount);
                    $('.timeCount').text(parseInt((now - imagePuzzle.startTime) / 1000, 10));
                }

                imagePuzzle.enableSwapping(this);
                imagePuzzle.enableSwapping($dragElem);
            }
        });
    },

    setImage: function (images, gridSize,i) {
        gridSize = gridSize || 3;
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
                'width': 400 / gridSize,
                'height': 400 / gridSize
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
        if(parseInt(i)==5){
            done=true;
            i=0;
            document.getElementById("btnDiv").style.display = "block";
        }
        imagePuzzle.startGame(images, gridSize,i);
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
            if(parseInt(i)<0){
                i=4;
            }
            imagePuzzle.startGame(images, gridSize,i);
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