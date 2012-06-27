var height = 500;
var width = 500;
var gridSize = 25;

var labelAreaSize = 100;

var currentRow = 0;
var totalRows = 0;

var paper;

function draw(){
  //TODO generate headers (dates or days of week)
  var dates = getDates();
  width = labelAreaSize + dates.length * gridSize;

  paper = Raphael("chart", width, height);

  currentRow++;

  grid();
  headers(dates);

  var phases = getPhases();

  for(p in phases){
    var tasks = phases[p].tasks;
    //TODO print phase name and bounds
    var caption = paper.text(5,(currentRow*gridSize)+(gridSize/2),phases[p].name);
    caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

    currentRow++;

    for(t in tasks){
      bar(tasks[t]);
    }
  }

}

function grid(){
  for(var y=gridSize; y < height; y+=gridSize){
    var pathExp = "M0," + y + "L" + width + "," + y;
    var gridLine = paper.path(pathExp);
    gridLine.attr({"stroke":"#000"});
  }

  //Draw vertical lines
  for(var x=labelAreaSize; x < width; x+=gridSize){
    var pathExp = "M" + x + ",0L" + x + "," + height;
    var gridLine = paper.path(pathExp);
  }
}

function headers(dates){
  var currentCol = 0;
  for(d in dates){
    var heading = paper.text(labelAreaSize + currentCol*gridSize + .5*gridSize, .5*gridSize,dates[d].format("M-D"));
    heading.attr({"text-anchor":"middle"});
    currentCol++;
  }
}

function bar(task){
  var x = task.startOffset*gridSize+labelAreaSize;
  var y = currentRow*gridSize;
  var barWidth = task.length*gridSize;
  var barHeight = gridSize;

  var bar = paper.rect(x, y, barWidth, barHeight);
  var caption = paper.text(10,y+(barHeight/2),task.name);
  caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

  bar.attr({"fill":"#000"});
  bar.hover(function(){
    bar.animate({"fill":"red"},100);
  }, function(){
    bar.animate({"fill":"#000"},100);
  });

  currentRow++;

  return bar;
}

function getDates(){
  //TODO Parse start/end dates from data
  var startDate = moment();
  var endDate = startDate.clone();
  endDate.add("months",1);

  var dates = [];

  while(startDate < endDate){
    dates.push(startDate.clone());
    startDate.add("days",1);
  }

  return dates;
}

function getPhases(){
  var phases = [
    {name : "Phase 1",
      tasks : [
        {name : "Task 1", length : 4, startOffset : 0},
        {name : "Task 2", length : 6, startOffset : 1}
      ]
    },
    {name : "Phase 2",
      tasks : [
        {name : "Task 3", length : 4, startOffset : 7},
        {name : "Task 4", length : 2, startOffset : 11}
      ]
    }
  ];
  return phases;
}