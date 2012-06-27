var height = 500;
var width = 500;
var gridSize = 25;

var labelAreaSize = 100;

// Starts at 1 so there is an empty row for headers
var currentRow = 1;

var paper;

function GanttChart(elementId){
  this.elementId = elementId;

  this.loadData = function(payload){
    this.phases = payload;
  }

  this.draw = function(){
    // Get the list of dates for the project duration
    var dates = getDates();
    // Calculate total graph width
    width = labelAreaSize + dates.length * gridSize;
    var rows = this.getRows();
    height = rows*gridSize;

    // Generate the chart area
    paper = Raphael(this.elementId, width, height);

    grid();
    headers(dates);

    // Iterate through all the phases, print labels and child tasks
    var phases = this.phases;
    for(p in phases){
      //TODO print phase bounds
      var caption = paper.text(5,(currentRow*gridSize)+(gridSize/2),phases[p].name);
      caption.attr({"font-size":14 , "stroke":"none" , "fill":"black", "text-anchor":"start"});

      currentRow++;

      var tasks = phases[p].tasks;
      for(t in tasks){
        bar(tasks[t]);
        currentRow++;
      }
    }

  }

  this.getRows = function(){
    var phases = this.phases;
    var rows = 1;
    for (p in phases){
      rows++;
      var tasks = phases[p].tasks;
      for(t in tasks){
        rows++;
      }
    }
    return rows;
  }

  // Draw the grid
  function grid(){
    // Draw horizontal grid lines
    for(var y=gridSize; y < height; y+=gridSize){
      var pathExp = "M0," + y + "L" + width + "," + y;
      var gridLine = paper.path(pathExp);
      gridLine.attr({"stroke":"#000"});
    }

    //Draw vertical grid lines (starts at the edge of the space allotted for phase/task labels)
    for(var x=labelAreaSize; x < width; x+=gridSize){
      var pathExp = "M" + x + ",0L" + x + "," + height;
      var gridLine = paper.path(pathExp);
    }
  }

  // Draws column headers, currently using M-D formatting
  function headers(dates){
    var currentCol = 0;
    for(d in dates){
      var heading = paper.text(labelAreaSize + currentCol*gridSize + .5*gridSize, .5*gridSize,dates[d].format("M-D"));
      heading.attr({"text-anchor":"middle"});
      currentCol++;
    }
  }

  // Draws a task bar
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

  }

  // Returns an array of dates for the duration of the project
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

}